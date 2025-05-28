import { Parser } from "json2csv";
import mongoose, { isValidObjectId } from "mongoose";
import Client from "../models/Client.mjs";
import Invoice from "../models/Invoice.mjs";
import Account from "../models/Account.mjs";
import { sendErrorResponse } from "../helpers/responseUtility.mjs";


const { Types } = mongoose;

// TODO : remove extra bkank lines
export const createClient = async (req, res) => {
  try {
    const { contact, name } = req.body; // destructor

    // // TODO: Improve validation to check for required fields more comprehensively
    // if (!contact || (!contact.email && !name)) {
    //   return res.status(400).json({ error: 'Either name or email must be provided' });
    // }
    // TODO: Validate email format more strictly. add method in utility
    if (contact && contact.email) {
      // TODO: no need to create email and use destructor, directly use contact.email
      const { email } = contact;
      // TODO: Handle case insensitivity in email comparison
      const existingClientEmail = await Client.findOne({
        "contact.email": email,
        account_id: req.user.account_id
      });
      if (existingClientEmail) {
        return sendErrorResponse(res, `Client already exists with email ${email}`, `Client already exists with email ${email}`, 409);      }
    }

    // TODO: Consider using a try-catch block for the client creation to handle any potential errors
    // TODO: use create method directly instead of instance and save
    const currency=isValidObjectId(req.body.currency)?req.body.currency:null;
    req.body.currency=currency
    const newClient = new Client(req.body); // Why is this important
    newClient.account_id = req.user.account_id;
    const savedClient = await newClient.save();
    return res.json(savedClient);
  } catch (err) {
    return sendErrorResponse(res, err, `Some Thing Went Wrong`, 500);      
  
  }
};

export const updateClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { address, ...fields } = req.body;
    const currency=isValidObjectId(fields.currency)?fields.currency:null;
    console.log(currency)
    fields.currency=currency
    // TODO: Extract a utility function for object validation isValidObjectId or use loadash

     
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return sendErrorResponse(res, "Invalid Client ID", "Please provide a valid Client ID", 400);      
    }
    // TODO: Consider using findByIdAndUpdate for a more efficient update
    // TODO: Move this call after checking for body and unique
    const existingClient = await Client.findOne({
      _id: clientId,
      account_id: req.user.account_id,
    });
    if (!existingClient) {
      return sendErrorResponse(res, "Client not found", "Client not found", 400);      
      
    }
    if (Object.keys(req.body).length === 0) {
      return sendErrorResponse(res, "Empty request body", "Please Enter Valid Data", 400);      
    }

    // TODO destruct req.body
    if (req.body.contact && req.body.contact.email) {
      const { email } = req.body.contact;
      // TODO: create a function isUnique
      const existingClientEmail = await Client.findOne({
        "contact.email": email,
        account_id:req.user.account_id,
      });
      if (
        existingClientEmail &&
        existingClientEmail.id.toString() !== clientId
      ) {
        return sendErrorResponse(res, `Client already exists with email ${email}`, `Client already exists with email ${email}`, 409);  
      }
    }
    // TODO : remove below line after using findByIdAndUpdate
    Object.assign(existingClient, fields);
    // Asign Address
    const { country_id, ...otherFields } = address;
    const updatedAddress = country_id ? address : otherFields;
    existingClient.address = updatedAddress;

    const updatedClient = await existingClient.save();
    // TODO : move response for client not found
    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    return sendErrorResponse(res, error, `Some Thing Went Wrong`, 500);      
  }
};

export const getClientById = async (req, res) => {
  try {
    const { clientId } = req.params;
    // TODO : add check for object ID validaity
    if(!mongoose.Types.ObjectId.isValid(clientId))
      return sendErrorResponse(res, "Invalid Client ID", "Please provide a valid Client ID", 400);      


    const client = await Client.findOne({
      _id: clientId,
      account_id: req.user.account_id,
    });
    // TODO: use 400 error here.
    if (!client) {
      return sendErrorResponse(res, "Client not found", "Client not found", 400);      
      
    }

    return res.status(200).json(client);
  } catch (error) {
    
    return sendErrorResponse(res, error, `Some Thing Went Wrong`, 500);      
  }
};

// TODO this method should be merged with getArchivedClients
// TODO use query parameter
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find({
      archived: false,
      account_id: req.user.account_id,
    });
    return res.json(clients);
  } catch (err) {
    return sendErrorResponse(res, err, `Some Thing Went Wrong`, 500);      
  }
};

export const archiveClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { archived } = req.body;

    // TODO : add check for object ID validaity
    // TODO use updateOne instead of find and save
    const clientArchive = await Client.findOne({
      _id: clientId,
      account_id: req.user.account_id,
    });
    // TODO : replace 404 with 400
    // TODO : check for nmodfied
    if (!clientArchive) {
      return sendErrorResponse(res, "Client not found", "Client not found", 400);      
    }

    clientArchive.archived = archived;
    const updatedClient = await clientArchive.save();
    // TODO : add message to the success , no need to return object
    return res.status(200).json(updatedClient);
  } catch (error) {
     return sendErrorResponse(res, err, `Some Thing Went Wrong`, 500);      
  }
};

// TODO merge with getClients
export const getArchivedClients = async (req, res) => {
  try {
    const clients = await Client.find({
      archived: true,
      account_id: req.user.account_id,
    });
    return res.status(200).json(clients);
  } catch (error) {
    return sendErrorResponse(res, err, `Some Thing Went Wrong`, 500);      
  }
};

export const searchClient = async (req, res) => {
  try {
    const { name } = req.query;
    const clients = await Client.find({
      name: { $regex: new RegExp(name, "i") },
      account_id: req.user.account_id,
    });
    if (clients.length === 0) {
      return sendErrorResponse(res, "No clients found with the provided name", "No clients found with the provided name", 400);      
    }

    return res.status(200).json({
      success: true,
      message: "Client retrieved successfully",
      clients,
    });
  } catch (error) {
    return sendErrorResponse(res, err, `Some Thing Went Wrong`, 500);      
  }
};

/**
 * Export clients' data to CSV.
 * @param {Object} req - The HTTP request object.
 * fields : name,email,address_1......
 * @param {Object} res - The HTTP response object.
 * @returns {Object} HTTP response object.
 */
// TODO: if there are any field that is not part of field mapping then show the error
// TODO: If no fields sent then return data with all fields
// TODO : remove commented code
// TODO: add to expert filtered records

export const exportClients = async (req, res) => {
  try {
    // Extract fields parameter from the request query
    const { fields } = req.query;
    // Define field mapping for frontend to backend field names

    const fieldMapping = {
      name: "name",
      email: "contact.email",
      address_1: "address.address_line_1",
      address_2: "address.address_line_2",
      phone: "contact.mobile",
      city: "address.city",
      state: "address.state",
      zip: "address.postal_code",
      isArchived: "archived",
      estimates_count: "estimateCount",
      invoices_count: "invoice_count",
      count_usd: "nacount_usdme",
      grand_total_usd: "total_amount",
      paid_usd: "total_payment",
      balance_usd: "balance_usd",
      overdue_usd: "overdue",
    };

    let selectedFields;
    if (!fields || typeof fields !== "string") {
      selectedFields = Object.keys(fieldMapping);
    } else {
      selectedFields = fields.split(",").map((field) => field.trim());
    }

    const mappedFields = selectedFields
      .map((field) => fieldMapping[field])
      .filter(Boolean);

    // Fetch clients data from the database
    const clients = await Client.find({ account_id: req.user.account_id });

  // Get all invoices related to these clients
  const invoices = await Invoice.aggregate([
    {
        $match: {
            'client.client_id': { $in: clients.map(client => client._id) }
        }
    },
    {
        $lookup: {
            from: 'estimates', // The name of the estimates collection
            localField: 'client.client_id', // The field in the Invoice collection
            foreignField: 'client.client_id', // The field in the Estimate collection that corresponds to client ID
            as: 'relatedEstimates' // The result will be stored in this field
        }
    },
    {
        $addFields: {
            estimateCount: { $size: '$relatedEstimates' } // Calculate the size of the relatedEstimates array
        }
    },
    {
        $group: {
            _id: '$client.client_id',
            invoiceCount: { $sum: 1 },
            totalAmount: { $sum: '$total' },
            totalPayment: { $sum: { $sum: '$total_payment' } }, // Adjust if payments are nested differently
            overdue: {
                $sum: {
                    $cond: [
                        { $lt: ['$due_date', new Date()] }, // Check if due_date is less than current date
                        '$amount_due',
                        0 // Otherwise, don't add anything
                    ]
                }
            },
            estimateCount: { $max: '$estimateCount' } // Since we already computed the size, just use $max to carry it over
        }
    }
]);

// Combine the aggregated data with client information
const clientsWithInvoiceDetails = clients.map(client => {
    const invoiceDetails = invoices.find(inv => inv._id.equals(client._id)) || {};
    return {
        ...client._doc,
        invoice_count: invoiceDetails.invoiceCount || 0,
        total_amount: invoiceDetails.totalAmount || 0,
        total_payment: invoiceDetails.totalPayment || 0,
        overdue: invoiceDetails.overdue || 0,
        estimateCount: invoiceDetails.estimateCount || 0 // Default to 0 if undefined
    };
});


    // Convert data to CSV format
    const json2csvParser = new Parser({ fields: mappedFields });
    const csvData = json2csvParser.parse(clientsWithInvoiceDetails);

    // Replace backend field names with frontend names
    Object.keys(fieldMapping).forEach((key) => {
      csvData.replace(new RegExp(fieldMapping[key], "g"), key);
    });

    // Set response headers for CSV download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=clients.csv");

    // Send CSV data as response
    return res.status(200).send(csvData);
  } catch (error) {
    return sendErrorResponse(res, err, `Some Thing Went Wrong`, 500);      
  }
};


export const fetchClients = async (req, res) => {
  try {
    const accountId = req.user.account_id;

    const { isArchived, client_id, name } = req.query;
    // console.log("term",isArchived, client_id, name);
    
    // Create the base query with accountId filter
    const clientQuery = { account_id: accountId };
    
    if (isArchived) {
      clientQuery.archived = isArchived === "true";
    }
    
    if (client_id) {
      clientQuery._id = Types.ObjectId(client_id);
    }
    
    if (name) {
      clientQuery.name = { $regex: name, $options: "i" };
    }
    
    // Fetch clients with the constructed query
    const clients = await Client.find(clientQuery).select("_id name archived");
    // console.log("client",clients);
    

    if (!clients.length) {
      return res.status(404).json({ message: "No clients found" });
    }

    // console.log("Clients:", JSON.stringify(clients, null, 2)); // Pretty-print clients

    const clientsWithInvoices = [];

    for (let client of clients) {
      try {
        const invoiceQuery = {
          "client.client_id": client._id,
          account: accountId,
          archived: false,
        };

        const invoices = await Invoice.find(invoiceQuery).select(
          " total total_payment amount_due due_date"
        ) .populate({
          path: "currency", // Populating `currency` by referencing the `Country` model
          select: "currency",
        });

        // console.log("Invoices for client:", JSON.stringify(invoices, null, 2)); // Pretty-print invoices

        clientsWithInvoices.push({
          client,
          invoices,
        });
        
      } catch (error) {
        console.error(
          "Error fetching invoices for client ID:",
          client._id,
          error
        );
      }
    }

    return res.status(200).json(clientsWithInvoices);
  } catch (error) {
    return sendErrorResponse(res, err, `Some Thing Went Wrong`, 500);      
  }
};

