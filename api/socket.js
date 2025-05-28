import { Server } from "socket.io";
import UtilityService from "./services/UtilityService.mjs";
import ClientService from "./services/ClientService.mjs";
import InvoiceService from "./services/InvoiceService.mjs";
import jwt from "jsonwebtoken";
import ItemService from "./services/ItemService.mjs";
import EstimateService from "./services/EstimateService.mjs";

let io;

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.auth;
  if (!token) {
    console.error(`Authentication failed for socket: ${socket.id}`);
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    next(new Error("Authentication error"));
  }
};

const sendWelcomeMessage = (socket) => {
  socket.emit("reply", {
    type: "welcome",
    text: "Hello! Welcome to Invoicer-wiz. I’m here to assist you. How can I help you today?",
  });
};

const initiateInvoiceCreation = (socket) => {
  socket.emit("reply", {
    type: "menu",
    text: "How would you like to create the invoice?",
    options: [
      "1️ Use a summary to quickly create an invoice",
      "2️ Let me guide you step-by-step to create the invoice",
    ],
  });

  socket.once("message", (mode) => {
    const choice = mode.toString().trim().replace(/[^\d]/g, "");
    console.log("Invoice creation mode selected:", choice);

    switch (choice) {
      case "1":
        handleSummaryFlow(socket);
        break;
      case "2":
        handleStepByStepFlow(socket);
        break;
      default:
        socket.emit("reply", { text: "Invalid selection. Please choose either 1 or 2." });
        initiateInvoiceCreation(socket); // Retry on invalid input
    }
  });
};

const handleSummaryFlow = (socket) => {
  socket.emit("reply", {
    text: "Alright, please provide the summary of the invoice (e.g., client name, items, total amount).",
  });

  socket.once("message", async (summary) => {
    console.log("User Summary:", summary);
    const accountId = socket.user.account_id;

    try {
      const invoice = await UtilityService.parseJSONFromInput(summary);
      const populatedInvoice = {
        items: invoice.items
      }
      if (invoice.currency) {
        const res = await UtilityService.fetchCurrencyId(invoice.currency);
        invoice.currency = res?._id;
        populatedInvoice.currency = res;
      }
      if (invoice.client) {
        const res = await handleClientAssociation(socket, invoice.client, accountId);
        invoice.client = res?._id;
        populatedInvoice.client = res;
      }

      socket.emit("reply", {
        type:"json",
        text: JSON.stringify(populatedInvoice),
      });
      confirmInvoiceCreation(socket, invoice, accountId);
    } catch (error) {
      console.error("Error processing invoice:", error);
      socket.emit("reply", {
        text: "An error occurred while processing the invoice. Please try again later.",
      });
      handleSummaryFlow(socket); // Retry on error
    }
  });
};


const handleStepByStepFlow = (socket) => {

  socket.emit("reply", {
    text: "Let's create the invoice step-by-step. Please provide the client name.",
  });

  socket.once("message", async (clientName) => {
    const accountId = socket.user.account_id;

    try {
      const client = await handleClientAssociation(socket, clientName, accountId);

      socket.emit("reply", {
        text: "Client associated. Please provide the items for the invoice.",
      });

      socket.once("message", async (items) => {
        try {
          const parsedItems = await ItemService.processAndValidateItems([{ name: items }], accountId);
          const invoice = { client: client._id, items: parsedItems };

          socket.emit("reply", {
            text: "Items added. Please provide the currency for the invoice.",
          });

          socket.once("message", async (currency) => {
            try {
              const currencyId = await UtilityService.fetchCurrencyId(currency);
              invoice.currency = currencyId._id;

              socket.emit("reply", {
                type:"json",
                text: JSON.stringify({ ...invoice, client, items: parsedItems, currency }),
              });

              confirmInvoiceCreation(socket, invoice, accountId);
            } catch (error) {
              console.error("Error processing currency:", error);
              socket.emit("reply", {
                text: "An error occurred while processing the currency. Please try again.",
              });
              handleStepByStepFlow(socket); // Retry on error
            }
          });
        } catch (error) {
          console.error("Error processing items:", error);
          socket.emit("reply", {
            text: "An error occurred while processing the items. Please try again.",
          });
          handleStepByStepFlow(socket); // Retry on error
        }
      });
    } catch (error) {
      console.error("Error associating client:", error);
      socket.emit("reply", {
        text: "An error occurred while associating the client. Please try again.",
      });
      handleStepByStepFlow(socket); // Retry on error
    }
  });
};
const confirmInvoiceCreation = (socket, invoice, accountId) => {
  socket.emit("reply", {
    type: "menu",
    options: ["confirm", "cancel"],
    text: "Please review the invoice details above. Reply with 'confirm' to create the invoice or 'cancel' to abort.",
    
  });

  socket.once("message", async (response) => {
    if (response.toLowerCase() === "confirm") {
      try {
        const createdInvoice = await InvoiceService.createAutomatedInvoice(invoice, accountId);
        socket.emit("reply", {
          type: "invoice-creation",
          invoiceId: createdInvoice._id,
          text: `Invoice Created Successfully, Invoice ID: ${createdInvoice._id}`,
        });
      } catch (error) {
        console.error("Error creating invoice:", error);
        socket.emit("reply", {
          text: "An error occurred while creating the invoice. Please try again later.",
        });
      }
    } else if (response.toLowerCase() === "cancel") {
      socket.emit("reply", {
        text: "Invoice creation has been canceled.",
      });
    }
    else {
      socket.emit("reply", {
        text: "Invalid input. Please reply with 'confirm' or 'cancel'.",
      });
      confirmInvoiceCreation(socket, invoice, accountId); // Retry on invalid input
    }
  });
};

const handleClientAssociation = async (socket, clientName, accountId) => {
  const client = await ClientService.findClientInDatabase(clientName, accountId);
  if (client && Array.isArray(client)) {
    const options = client.map((clientObj) => clientObj.client.name);
    socket.emit("reply", {
      type: "menu",
      text: `Found some matchung clients,please select one of the following clients`,
      options:[...options,'Create-A-New-One']
    });

    const userResponse = await new Promise((resolve) => socket.once("message", resolve));
    console.log("User Response:", userResponse);
    if(userResponse === 'Create-A-New-One'){
      const newClient = await ClientService.createClient(clientName, accountId);
      return newClient;
    }
    const selectedClient = client.find(clientObj => clientObj.client.name === userResponse)
    console.log("Selected Client:", selectedClient);
    return selectedClient.client;
  }
  else if (client && !Array.isArray(client)) {
    return client.client;
  }
  else {
    socket.emit("reply", {
      type: "menu",
      text: `No matching client found. Would you like to create a new client with the name "${clientName}"?`,
      options: ['Yes', 'No']
    });
    const userResponse = await new Promise((resolve) => socket.once("message", resolve));
    if (userResponse.toLowerCase() === 'yes') {
      const newClient = await ClientService.createClient(clientName, accountId);
      return newClient;
    }
  }
};
const handleModeSelection = (socket, option) => {
  const choice = option.toString().trim().replace(/[^\d]/g, "");
  console.log("Normalized choice:", choice);

  switch (choice) {
    case "1":
      initiateInvoiceCreation(socket);
      break;
    case "2":
      initiateEstimateCreation(socket)
      break;
    case "3":
      socket.emit("reply", { text: "Please provide the expense details." });
      break;
    case "4":
      socket.emit("reply", { text: "Please provide the quote ID to convert it to an invoice." });
      break;
    default:
      socket.emit("reply", {
        text: "Invalid input. Please choose an option from the menu.",
      });
      handleModeSelection(socket, newOption); // Retry on invalid input

  }
};
export const initializeWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    sendWelcomeMessage(socket);

    socket.on("joined", () => {
      socket.broadcast.emit("userjoined", { user: socket.id, message: "has joined" });
    });

    socket.on("mode-selection", (option) => handleModeSelection(socket, option));

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      socket.broadcast.emit("userleft", { user: socket.id, message: "has left" });
    });
  });
};

const initiateEstimateCreation = (socket) => {
  socket.emit("reply", {
    type: "menu",
    text: "How would you like to create the estimate?",
    options: [
      "1️ Use a summary to quickly create an estimate",
      "2️ Let me guide you step-by-step to create the estimate",
    ],
  });

  socket.once("message", (mode) => {
    const choice = mode.toString().trim().replace(/[^\d]/g, "");
    console.log("Estimate creation mode selected:", choice);

    switch (choice) {
      case "1":
        handleEstimateSummaryFlow(socket);
        break;
      case "2":
        handleEstimateStepByStepFlow(socket);
        break;
      default:
        socket.emit("reply", { text: "Invalid selection. Please choose either 1 or 2." });
        initiateEstimateCreation(socket); // Retry on invalid input
    }
  });
};

const handleEstimateSummaryFlow = (socket) => {
  socket.emit("reply", {
    text: "Alright, please provide the summary of the estimate (e.g., client name, items, total amount).",
  });

  socket.once("message", async (summary) => {
    console.log("User Summary:", summary);
    const accountId = socket.user.account_id;

    try {
      const estimate = await UtilityService.parseJSONFromInput(summary);
      const populatedEstimate = {
        items: estimate.items
      }
      if (estimate.currency) {
        const res = await UtilityService.fetchCurrencyId(estimate.currency);
        estimate.currency = res._id;
        populatedEstimate.currency = res;
      }
      if (estimate.client) {
        const res = await handleClientAssociation(socket, estimate.client, accountId);
        estimate.client = res._id;
        populatedEstimate.client = res;
      }

      socket.emit("reply", {
        text: JSON.stringify(populatedEstimate),
      });
      confirmEstimateCreation(socket, estimate, accountId);
    } catch (error) {
      console.error("Error processing estimate:", error);
      socket.emit("reply", {
        text: "An error occurred while processing the estimate. Please try again later.",
      });
      handleEstimateSummaryFlow(socket); // Retry on error
    }
  });
};

const handleEstimateStepByStepFlow = (socket) => {
  socket.emit("reply", {
    text: "Let's create the estimate step-by-step. Please provide the client name.",
  });

  socket.once("message", async (clientName) => {
    const accountId = socket.user.account_id;

    try {
      const client = await handleClientAssociation(socket, clientName, accountId);

      socket.emit("reply", {
        text: "Client associated. Please provide the items for the estimate.",
      });

      socket.once("message", async (items) => {
        try {
          const parsedItems = await ItemService.processEstimateItems([{ name: items }], accountId);
          const estimate = { client: client._id, items: parsedItems };

          socket.emit("reply", {
            text: "Items added. Please provide the currency for the estimate.",
          });

          socket.once("message", async (currency) => {
            try {
              const currencyId = await UtilityService.fetchCurrencyId(currency);
              estimate.currency = currencyId._id;

              socket.emit("reply", {
                text: JSON.stringify({ ...estimate, client, items: parsedItems, currency }),
              });

              confirmEstimateCreation(socket, estimate, accountId);
            } catch (error) {
              console.error("Error processing currency:", error);
              socket.emit("reply", {
                text: "An error occurred while processing the currency. Please try again.",
              });
              handleEstimateStepByStepFlow(socket); // Retry on error
            }
          });
        } catch (error) {
          console.error("Error processing items:", error);
          socket.emit("reply", {
            text: "An error occurred while processing the items. Please try again.",
          });
          handleEstimateStepByStepFlow(socket); // Retry on error
        }
      });
    } catch (error) {
      console.error("Error associating client:", error);
      socket.emit("reply", {
        text: "An error occurred while associating the client. Please try again.",
      });
      handleEstimateStepByStepFlow(socket); // Retry on error
    }
  });
};

const confirmEstimateCreation = (socket, estimate, accountId) => {
  socket.emit("reply", {
    text: "Please review the estimate details above. Reply with 'confirm' to create the estimate or 'cancel' to abort.",
  });

  socket.once("message", async (response) => {
    if (response.toLowerCase() === "confirm") {
      try {
        const createdEstimate = await EstimateService.createAutomatedEstimate(estimate, accountId);
        socket.emit("reply", {
          text: `Estimate Created Successfully, Estimate ID: ${createdEstimate._id}`,
        });
      } catch (error) {
        console.error("Error creating estimate:", error);
        socket.emit("reply", {
          text: "An error occurred while creating the estimate. Please try again later.",
        });
      }
    } else if (response.toLowerCase() === "cancel") {
      socket.emit("reply", {
        text: "Estimate creation has been canceled.",
      });
    } else {
      socket.emit("reply", {
        text: "Invalid input. Please reply with 'confirm' or 'cancel'.",
      });
      confirmEstimateCreation(socket, estimate, accountId); // Retry on invalid input
    }
  });
};

export default io;
