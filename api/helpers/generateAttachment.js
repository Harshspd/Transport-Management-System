import Invoice from "../models/Invoice.mjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { formatDate } from "./utilis/formatDate.mjs";
import { getTemplate } from "./templateHelper.mjs";
import { generatePdfBufferByHTML } from "./templateHelper.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ensureDirectoryExists = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

// save the pdf to correct path and move the existing pdf by changing name to old(invoice_number).pdf
export const generateAttachmentUrl = async (invoiceNumber) => {
  let invoice = await Invoice.findOne({ invoice_number: invoiceNumber });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  const invoiceFolderPath = path.join(
    __dirname,
    "..",
    "INVOICE",
    invoiceNumber.toString()
  );
  const newPdfPath = path.join(invoiceFolderPath, `new${invoiceNumber}.pdf`);

  ensureDirectoryExists(invoiceFolderPath);

  if (fs.existsSync(newPdfPath)) {
    const dateInEmailSent = formatDate(invoice.last_email_sent || new Date());
    const oldPdfPath = path.join(
      invoiceFolderPath,
      `old.${dateInEmailSent}.pdf`
    );
    fs.renameSync(newPdfPath, oldPdfPath);
  }

  invoice.last_email_sent = new Date();
  await invoice.save();

  return await generatePDF(invoiceNumber);
};

const generatePDF = async (invoiceNumber) => {
  try {
    const invoice = await fetchInvoice(invoiceNumber);
    // Define the template path and output folder
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const htmlTemplatePath = path.join(
      __dirname,
      "..",
      "documents",
      "invoiceTemplate.hbs"
    );
    const uploadFolder = path.join(
      __dirname,
      "..",
      "INVOICE",
      invoiceNumber.toString()
    );

    // Use the getTemplate function to create HTML string
    // console.log("invoice", invoice);
    const htmlString = await getTemplate(invoice, htmlTemplatePath);

    // Use the generatePdfBufferByHTML to create the PDF buffer
    const pdfFileName = `new${invoiceNumber}.pdf`;
    const { pdfFilePath, pdfBuffer } = await generatePdfBufferByHTML(
      uploadFolder,
      htmlString,
      pdfFileName
    );

    // Write the PDF file to disk
    fs.writeFileSync(pdfFilePath, pdfBuffer);

    // Return the path to the generated PDF file
        console.log("invoice working till here");
// 
    return pdfFilePath;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
};

const fetchInvoice = async (invoiceNumber) => {
  try {
    const object = await Invoice.findOne({ invoice_number: invoiceNumber })
      .populate({
        path: "account",
        populate: {
          path: "address",
          populate: { path: "country_id" },
        },
      })
      .populate({
        path: "client.client_id",
        populate: { path: "address" },
      })
      .populate("client.billing_address")
      .populate("client.shipping_address")
      .populate("currency")
      .populate({
        path: "items.item",
        populate: { path: "taxes" },
      })
      .populate("taxes.tax_id")
      .lean()
      .exec();

    if (!object) {
      throw new Error("Invoice not found");
    }

    return object;
  } catch (error) {
    console.error("Error fetching invoice:", error.message);
    throw new Error("Failed to fetch invoice");
  }
};
