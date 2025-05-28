import mongoose from 'mongoose';
import { Parser } from 'json2csv';
import moment from 'moment';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import Account from '../models/Account.mjs';
import Client from '../models/Client.mjs';
import Invoice from '../models/Invoice.mjs';
import { sendEmail } from '../helpers/emailHelper.mjs';
import { invoiceByMail } from '../email/invoiceMailTemplate.mjs';
import creditNoteByMail from '../email/creditNoteTemplate.mjs';
import { getInvoiceData, getTemplate, generatePdfBufferByHTML } from '../helpers/templateHelper.mjs';
import InvoiceService from '../services/InvoiceService.mjs';
import AccountService from '../services/AccountService.mjs';
import { sanitizeFileName } from '../helpers/utililty.mjs';
import { sendErrorResponse } from "../helpers/responseUtility.mjs";
import PurchaseService from '../services/PurchaseService.mjs';
import InventoryService from '../services/InventoryService.mjs';
import PdfGenerationService from '../services/PdfGenerationService.mjs';
import UtilityService from '../services/UtilityService.mjs';
import Item from '../models/Item.mjs';
import ItemService from '../services/ItemService.mjs';
import ClientService from '../services/ClientService.mjs';

export const createInvoice = async (req, res) => {
  const {
    client,
    estimate,
    billingPeriodEnd,
    billingPeriodStart,
    issued_date,
    due_date,
    currency,
    language,
    invoice_number,
    reference_number,
    items,
    discounts,
    taxes,
    transactions,
    subtotal,
    tax_total,
    total,
    notes,
    terms,
    attachments,
    status,
    total_deposit,
    total_payment,
    amount_due,
    archived,
    reminder_invoice,
    sent,
    created_by,
    updated_by,
  } = req.body;
  try {

    const account = req.user.account_id;
    const existingAccount = await Account.findById(account);
    if (!existingAccount) {
      return sendErrorResponse(res, 'Account not found', 'Account not found', 400);

    }

    let clientId = null;
    let existingClient = null;

    // Check if client_id is provided

    if (client && client.client_id) {
      if (!mongoose.Types.ObjectId.isValid(client.client_id)) {
        return sendErrorResponse(res, "Invalid Client ID", "Please provide a valid Client ID", 400);

      }

      existingClient = await Client.findById(client.client_id);
      if (existingClient) {
        clientId = client.client_id;
      }
    }

    // Create invoice object
    const newInvoice = new Invoice({
      account,
      estimate,
      client: {
        client_id: clientId,
        billing_address: client.billing_address || null,
        shipping_address: client.shipping_address || null,
      },
      issued_date,
      due_date,
      currency,
      language,
      invoice_number,
      reference_number,
      items,
      discounts,
      taxes,
      transactions,
      subtotal,
      tax_total,
      total,
      notes,
      terms,
      attachments,
      status: 'Created',
      total_deposit,
      total_payment,
      amount_due,
      archived,
      reminder_invoice,
      sent,
      created_by,
      updated_by,
      billingPeriodEnd,
      billingPeriodStart
    });
    const status_log = { status, updated_on: Date.now() };
    newInvoice.status_log.push(status_log);


    // Extract serialNo and Prefix
    if (!invoice_number) return sendErrorResponse(res, "Invoice number Required", "Invoice number is required", 400);
    const prefix = InvoiceService.getPrefix(invoice_number);
    const serialNo = InvoiceService.getSerialNumber(invoice_number);
    AccountService.updateInvoicePrefix(account, prefix);
    if (!await InvoiceService.isInvoiceNumberUnique(account, invoice_number)) {
      return sendErrorResponse(res, "Invoice number already exists", "Invoice number already exists", 409);

    }
    newInvoice.serial_no = serialNo;
    // Save the invoice to the database
    const savedInvoice = await newInvoice.save();
    res.status(201).json({
      message: 'Invoice created successfully',
      data: savedInvoice,
    });
  } catch (error) {
    console.log(error);
    return sendErrorResponse(res, error, `Some Thing Went Wrong`, 500);
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const updateData = req.body;
    const account = req.user.account_id
    const invoice_number = req.body.invoice_number
    if (!invoice_number) return sendErrorResponse(res, "Invoice number Required", "Invoice number is required", 400);
    const prefix = InvoiceService.getPrefix(invoice_number);
    AccountService.updateInvoicePrefix(account, prefix);
    if (!await InvoiceService.isInvoiceNumberUnique(account, invoice_number, invoiceId)) {
      return sendErrorResponse(res, "Invoice number already exists", "Invoice number already exists", 409);
    }
    updateData.serial_no = InvoiceService.getSerialNumber(invoice_number)
    // Find and update the invoice

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      account: req.user.account_id
    });

    if (!invoice) {
      return sendErrorResponse(res, 'Invoice not found', 'Invoice not found', 400);
    }

    /*if (
      invoice.status === 'Paid' ||
      invoice.status === 'Refunded' ||
      invoice.status === 'Partial Paid'
    ) {
      return sendErrorResponse(res, 'Only Unpaid or New invoices can be edited', 'Only Unpaid or New invoices can be edited', 403);

    }*/

    // Update the invoice
    invoice.set({...invoice,...updateData});
    invoice.status_log.push({
      status: 'Updated',
      updated_on: Date.now(),
    });
    invoice.updated_on = Date.now()
    const updatedInvoice = await invoice.save();


    return res.status(200).json({
      message: 'Invoice updated successfully',
      data: updatedInvoice,
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return sendErrorResponse(res, error, `Some Thing Went Wrong`, 500);

  }
};

export const searchInvoicesByClientName = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return sendErrorResponse(res, 'Name query parameter is required', 'Name is required', 400);
  }

  try {
    // Find invoices by client_id
    const invoices = await Invoice.aggregate([
      {
        $lookup: {
          from: 'clients',
          localField: 'client.client_id',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $unwind: '$client',
      },
      {
        $match: {
          'client.name': { $regex: new RegExp(name, 'i') },
          account: new mongoose.Types.ObjectId(req.user.account_id),
        },
      },
    ]);

    if (invoices.length === 0) {
      return sendErrorResponse(res, 'No invoices found for the given client name', 'No invoices found for the given client name', 400);
    }

    res.status(200).json({
      message: 'Invoices retrieved successfully',
      data: invoices,
    });
  } catch (error) {
    console.log(error);
    return sendErrorResponse(res, error, `Some Thing Went Wrong`, 500);
  }
};

export const getInvoiceById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return sendErrorResponse(res, `Invalid invoice ID`, `Invalid invoice ID`, 400);

  }

  try {
    const invoice = await Invoice.findOne({
      _id: id,
      account: req.user.account_id,
    })
      .populate({
        path: 'account',
        populate: {
          path: 'address',
          populate: {
            path: 'country_id',
            model: 'Country',
          },
        },
      })
      .populate('client.client_id')
      .populate('client.billing_address')
      .populate('client.shipping_address')
      .populate('currency')
      .populate('items.item')
      .populate('taxes.tax_id')
      .exec();
    // .populate('created_by')
    // .populate('updated_by')

    if (!invoice) {
      return sendErrorResponse(res, `Invalid Not Found`, `Invalid Not Found`, 400);
    }

    res
      .status(200)
      .json({ message: 'invoice retrieved successfully', data: invoice });
  } catch (error) {
    console.log(error);
    return sendErrorResponse(res, error, `Some Thing Went Wrong`, 500);
  }
};

export const getInvoices = async (req, res) => {
  try {
    const query = Invoice.find({
      archived: false,
      account: req.user.account_id,
    })
      .populate('client.client_id')
      .populate('currency')
      .sort({ created_on: -1 });
    if (req.query.latest ==='true') {
      query.limit(10); 
    }

    const invoices = await query.exec();

    res
      .status(200)
      .json({ message: 'Invoices retrieved successfully', data: invoices });
  } catch (error) {
    console.error('Error retrieving invoices:', error);

    return sendErrorResponse(res, error, `Some Thing Went Wrong`, 500);
  }
};

export const deleteInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendErrorResponse(res, 'Invalid Invoice ID', 'Invalid Invoice ID', 400);


    }

    const invoice = await Invoice.findOneAndDelete({
      _id: id,
      account: req.user.account_id,
    });
    if (!invoice) {
      return sendErrorResponse(res, 'Invoice not found', 'Invoice not found', 400);

    }

    res.status(200).json({
      message: 'Invoice deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting Invoice:', error);
    return sendErrorResponse(res, error, `Some Thing Went Wrong`, 500);

  }
};

export const toggleArchiveInvoice = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendErrorResponse(res, 'Invalid Invoice ID', 'Invalid Invoice ID', 400);

    }
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: id, account: req.user.account_id },
      [{ $set: { archived: { $eq: [false, '$archived'] } } }],
      { new: true },
    );

    if (!updatedInvoice) {
      return sendErrorResponse(res, 'Invoice not found', 'Invoice not found', 404);

    }

    res.status(200).json({
      message: `Invoice ${updatedInvoice.archived ? 'archived' : 'unarchived'
        } successfully`,
      data: updatedInvoice,
    });
  } catch (error) {
    console.error('Error toggling archive status of invoice:', error);
    return sendErrorResponse(res, error, `Some Thing Went Wrong`, 500);

  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
export const getInvoiceNumber = async (req, res) => {
  try {
    const { invoiceNumber, newSerialNo } = await InvoiceService.generateInvoiceNumber(req.user.account_id);
    res.json({ invoiceNumber, serial_no: newSerialNo });
  } catch (error) {
    return sendErrorResponse(res, error, `Some Thing Went Wrong`, 500);
  }
};

export const transformOutput = (query) => query.populate('client.client_id').populate('currency');

export const getArchivedInvoices = async (req, res) => {
  try {
    // Find all invoices where the archived field is true
    const archivedInvoices = await transformOutput(
      Invoice.find({ archived: true, account: req.user.account_id }),
    ).exec();

    // Respond with the retrieved archived invoices
    res
      .status(200)
      .json({
        message: 'Archived Invoices retrieved successfully',
        data: archivedInvoices,
      });
  } catch (error) {
    console.error('Error retrieving archived Invoices:', error);
    return sendErrorResponse(res, error, `Some Thing Went Wrong`, 500);

    // res
    //   .status(500)
    //   .json({ message: 'Error retrieving archived invoices', error });
  }
};

export const exportInvoicesToCSV = async (req, res) => {
  try {
    const { fieldsToInclude, paid, balance } = req.body; // Assuming fieldsToInclude is an array of selected field names

    // Find all estimates and populate the client details
    const Invoices = await transformOutput(
      Invoice.find({ account: req.user.account_id }),
    ).exec();

    // Extract the required fields based on user selection
    const csvData = Invoices.map((invoice) => {
      const client = invoice.client.client_id;
      const data = {
        Number: invoice.invoice_number,
        Issued: moment(invoice.issued_date).format('M/D/YYYY'),
        Due: moment(invoice.due_date).format('M/D/YYYY'),
        Status: invoice.status,
        Client: client ? client.name : '',
        Client_Email: client && client.contact ? client.contact.email : '',
        Currency: invoice && invoice.currency ? invoice.currency.currency : '',
        Total: invoice.total,
        isArchived: invoice.archived,
        Paid: invoice.total_payment,
        Balance: invoice.amount_due,
      };

      // Filter out fields not included in the selection
      const filteredData = {};
      fieldsToInclude.forEach((field) => {
        if (data.hasOwnProperty(field)) {
          filteredData[field] = data[field];
        }
      });

      return filteredData;
    });

    // Convert the data to CSV
    const json2csvParser = new Parser({ fields: fieldsToInclude });
    const csv = json2csvParser.parse(csvData);

    // Set the response headers to indicate a file attachment
    res.header('Content-Type', 'text/csv');
    res.attachment('all_invoices.csv');
    return res.send(csv);
  } catch (error) {
    console.error('Error exporting Invoices to CSV:', error);
    return sendErrorResponse(res, error, `Some Thing Went Wrong`, 500);

  }
};

export const getInvoicePdf = async (req, res) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const uploadFolder = path.join(__dirname, '../uploads');

  try {
    const { id } = req.params;
    const { mode } = req.query;
    const output = req.query?.out;// for debugging
    const invoice = await PdfGenerationService.getInvoiceData(id); // Getting invoice data from DB

    const htmlTemplatePath = path.join(
      __dirname,
      '..',
      'documents',
      'invoiceTemplate.hbs',
    );
    const htmlString = await PdfGenerationService.getTemplate(invoice, htmlTemplatePath); // Creating HTML template with the invoice data
    if (output == "html")
      res.send(htmlString);
    else {
      const pdfFileName = `inv-wiz-version${UtilityService.sanitizeFileName(invoice.invoice_number)}${invoice._id}_${Date.now()}.pdf`;
      const { pdfFilePath, pdfBuffer } = await PdfGenerationService.generatePdfBufferByHTML(uploadFolder, htmlString, pdfFileName); // PDF generation
      fs.writeFileSync(pdfFilePath, pdfBuffer);

      if (mode === 'view') {
        // Save the file

        // Set headers for inline display
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=${pdfFileName}`);

        // Send the file
        res.sendFile(pdfFilePath, (err) => {
          // Delete the file after sending
          fs.unlink(pdfFilePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error deleting the PDF file:', unlinkErr);
            }
          });

          if (err) {
            console.error('Error sending the PDF file:', err);
            return sendErrorResponse(res, error, 'Failed to generate PDF file', 500);
          }
        });
      } else {
        // Save the PDF file to disk

        // Send the file as a download or other mode
        res.sendFile(pdfFilePath, (err) => {
          if (err) {
            console.error('Error sending the PDF file:', err);
            return sendErrorResponse(res, error, `Failed to send PDF file`, 500);
          } else {
            console.log('PDF file sent successfully');
          }
        });
      }
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    return sendErrorResponse(res, error, `Something Went Wrong`, 500);

  }
};
export const sendInvoiceAndMarkSent = async (req, res) => {
  const { id } = req.params;
  const { email, fromName, clientName, clientMessage,cc,bcc } = req.body;
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const uploadFolder = path.join(__dirname, '../uploads');
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendErrorResponse(res, `Invalid invoice ID`, `Invalid invoice ID`, 400);
    }

    const invoiceData = await PdfGenerationService.getInvoiceData(id); // Getting invoice data from DB
    const htmlTemplatePath = path.join(
      __dirname,
      '..',
      'documents',
      'invoiceTemplate.hbs',
    );
    const htmlString = await PdfGenerationService.getTemplate(invoiceData, htmlTemplatePath); // Creating HTML template with the invoice data
    const pdfFileName = `inv-wiz-version_${UtilityService.sanitizeFileName(invoiceData.invoice_number)}_${invoiceData._id}_${Date.now()}.pdf`;
    const { pdfFilePath, pdfBuffer } = await PdfGenerationService.generatePdfBufferByHTML(uploadFolder, htmlString, pdfFileName); // PDF generation
    fs.writeFileSync(pdfFilePath, pdfBuffer);

    // const attachmentPath = await generateAttachmentUrl(invoice.invoice_number);
    const htmlContent = invoiceByMail(
      invoiceData,
      fromName,
      clientName,
      clientMessage
    );
    const attachments = [];
    if (pdfFilePath) {
      attachments.push({
        filename: path.basename(pdfFilePath), // Extract the file name from the path
        path: pdfFilePath, // The path to the saved PDF file
      });
      console.log('PDF file found and will be sent with the email.');
    } else {
      console.warn('No PDF file path found to send with the email.');
    }
    await sendEmail(
      email,
      `Invoice ${invoiceData.invoice_number} From ${invoiceData.account.name}`,
      htmlContent,
      attachments,
      cc,
      bcc
    );
    const invoice = await Invoice.findOne({ _id: id, account: req.user.account_id });
    invoice.sent = true;
    invoice.updated_on = Date.now();
    invoice.status_log.push({ status: 'Sent', updated_on: Date.now() });
    await invoice.save();

    res
      .status(200)
      .json({ message: 'Invoice sent successfully', data: invoice });
  } catch (error) {
    console.error('Error sending invoice:', error);
    return sendErrorResponse(res, error, `Something Went Wrong`, 500);
  }
};
export const refundInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendErrorResponse(res, `Invalid invoice ID`, `Invalid invoice ID`, 400);
    }
    const invoice = await Invoice.findOneAndUpdate(
      { _id: id, account: req.user.account_id },
      {
        $set: {
          refund: true,
          status: 'Refunded',
          updated_on: Date.now(),
          credit_note_no: '' // Temporary placeholder
        },
        $push: {
          status_log: {
            updated_on: Date.now(),
            status: 'Refunded',
          },
        },
      },
      { new: true }
    )
      .populate({
        path: 'account',
        populate: { path: 'address' },
      })
      .populate('client.client_id')
      .populate('currency')
      .exec();
    if (!invoice) {
      return sendErrorResponse(res, `Invoice not found`, `Invoice not found`, 400);

    }
    invoice.credit_note_no = `CN-${(new Date()).getFullYear()}-${invoice.serial_no.toString().padStart(4, '0')}`;
    await invoice.save();

    const recipient = invoice?.client?.client_id?.contact?.email;
    const subject = `Invoice ${invoice.invoice_number} from ${invoice?.account?.name}`;
    const htmlContent = creditNoteByMail(invoice);
    sendEmail(recipient, subject, htmlContent)
      .then(() => console.log('Email sent successfully'))
      .catch((error) => console.error('Failed to send email:', error));

    return res.status(200).json({
      message: 'Invoice refunded successfully',
      data: invoice,
    });
  } catch (error) {
    // Log and respond with an error message
    console.error('Error refunding invoice:', error);
    return sendErrorResponse(res, error, `Something Went Wrong`, 500);

  }
};

export const searchInvoiceByItemId = async (req, res) => {
  const { id } = req.params;
  try {
    const invoices = await Invoice.find({
      'items.item': id,
      account: req.user.account_id,
    })
      .populate('account')
      .populate('client.client_id')
      .populate('client.billing_address')
      .populate('client.shipping_address')
      .populate('currency')
      .populate('items.item')
      .populate('taxes.tax_id')
      .exec();

    if (invoices.length === 0) {
      return res
        .status(200)
        .json({ message: 'No invoices found for the given item ID', data: [] });
    }

    res
      .status(200)
      .json({ message: 'Invoices retrieved successfully', data: invoices });
  } catch (error) {
    return sendErrorResponse(res, error, `Something Went Wrong`, 500);
  }
};

export const addPaymentToInvoice = async (req, res) => {
  const { invoiceId, amount, date, depositId ,_id } = req.body;
  const accountId = req.user.account_id
  if (!invoiceId && !amount && !date) return sendErrorResponse(res, 'Invoice ID,Amount,Date Required', 'Invoice ID,Amount,Date Required', 400);

  try {
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return sendErrorResponse(res, `Invalid invoice ID`, `Invalid invoice ID`, 400);
    }
    let invoice;
    if (_id)
      invoice = await InvoiceService.editPayment(accountId, invoiceId, amount, _id)
    else
      invoice = await InvoiceService.addPayment(accountId, invoiceId, date, amount,depositId)

    return res.status(200).json({
      message: "Payment Added",
      data: invoice,
    });
  } catch (error) {
    // Log and respond with an error message
    console.error('Error adding payment:', error);
    return sendErrorResponse(res, error, `Something Went Wrong`, 500);

  }
};
export const deletePaymentFromInvoice = async (req, res) => {
  const { invoiceId, transactionId } = req.query;

  const accountId = req.user.account_id
  if (!invoiceId || !transactionId) return sendErrorResponse(res, 'Invoice ID,Transaction Id  Required', 'Invoice ID,Transaction Id  Required', 400);
  try {
    let invoice = await InvoiceService.deletePayment(accountId, invoiceId, transactionId);

    return res.status(200).json({
      message: "Payment Deleted",
      data: invoice,
    });
  } catch (error) {
    console.error('Error Deleting payment:', error);
    return sendErrorResponse(res, error, `Something Went Wrong`, 500);

  }s
};

export const createInvoiceFromPurchase = async (req, res) => {
  const { clientId, maxItem } = req.body;
  const { purchaseId } = req.params;
  const createdInvoices = []; // Track created invoices

  try {
    const account = req.user.account_id;
    const existingAccount = await Account.findById(account);
    if (!existingAccount) return sendErrorResponse(res, 'Account not found', 'Account not found', 400);

    // Validate clientId and retrieve client
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return sendErrorResponse(res, "Invalid Client ID", "Please provide a valid Client ID", 400);
    }
    const existingClient = await Client.findOne({ _id: clientId, account_id: account });
    if (!existingClient) return sendErrorResponse(res, "Client not found", "Client not found", 400);

    // Validate purchaseId and retrieve purchase
    if (!mongoose.Types.ObjectId.isValid(purchaseId)) {
      return sendErrorResponse(res, "Invalid Purchase ID", "Please provide a valid Purchase ID", 400);
    }
    const purchase = await PurchaseService.getPurchaseById(purchaseId, account);
    if (!purchase) return sendErrorResponse(res, "Purchase not found", "Purchase not found", 400);

    const itemsPerInvoice = maxItem || purchase.items.length; // Default to all items if maxItem is not provided
    const totalInvoices = Math.ceil(purchase.items.length / itemsPerInvoice);

    for (let i = 0; i < totalInvoices; i++) {
      const start = i * parseInt(itemsPerInvoice);
      const end = start + parseInt(itemsPerInvoice);
      const invoiceItems = purchase.items.slice(start, end);

      if (invoiceItems.length === 0) break; // Stop if no items left to process

      const issued_date = new Date();
      const due_date = new Date(issued_date);
      due_date.setDate(due_date.getDate() + 30);
      const { invoiceNumber, newSerialNo } = await InvoiceService.generateInvoiceNumber(req.user.account_id);

      const items = invoiceItems.map(item => ({
        item: item.itemId._id,
        quantity: item.quantity,
        line_total: item.quantity * item.salePrice,
        name: item.itemId.name,
        description: item.itemId.description,
        price: item.salePrice,
        itemTax: item.itemId.taxes,
        batchNo:item.batchNo,
        expDate:item.expDate
      }));

      const subtotal = invoiceItems.reduce((total, item) => total + item.salePrice * item.quantity, 0);

      let taxTotal = 0;
      invoiceItems.forEach(item => {
        if (item.itemId.taxable) {
          const itemTaxTotal = item.itemId.taxes.reduce((sum, tax) => sum + (item.salePrice * (tax.rate / 100)), 0);
          taxTotal += itemTaxTotal * item.quantity;
        }
      });

      const total = subtotal + taxTotal;
      const newInvoice = new Invoice({
        account,
        client: {
          client_id: clientId,
          billing_address: null,
          shipping_address: null,
        },
        issued_date,
        due_date,
        serial_no: newSerialNo,
        invoice_number: invoiceNumber,
        currency: existingAccount?.currency,
        items,
        taxes:[
          ...Array.from(
            new Map(
              invoiceItems.flatMap(item =>
                item.itemId.taxes.map(tax => [
                  `${tax._id}_${tax.name}_${tax.rate}`,  // Unique key: tax_id + name + rate
                  {
                    tax_id: tax._id,
                    name: tax.name,
                    rate: tax.rate,
                    amount: item.salePrice * (tax.rate / 100) * item.quantity,  // Calculated tax amount
                  }
                ])
              )
            ).values()  // Extract the unique tax objects
          )
        ],
        subtotal,
        tax_total: taxTotal,
        total,
        notes: existingAccount?.invoiceSettings?.notes,
        terms: existingAccount?.invoiceSettings?.terms,
        status: 'Created',
        amount_due: total,
        created_by: req.user._id,
      });

      newInvoice.status_log.push({ status: 'Created', updated_on: Date.now() });

      const savedInvoice = await newInvoice.save();
      createdInvoices.push(savedInvoice); // Track created invoice

      try {
        for (const item of invoiceItems) {
          await InventoryService.reduceStock(item.itemId._id, item.quantity, item.batchNo, savedInvoice._id, account);
        }
      } catch (error) {
        // Rollback created invoices if stock reduction fails
        console.log("Error reducing stock, rolling back created invoices...");
        for (const createdInvoice of createdInvoices) {
          await Invoice.findByIdAndDelete(createdInvoice._id);
        }
        return sendErrorResponse(res, "Insufficient stock. Rolled back created invoices.", "Insufficient stock.", 400);
      }
    }

    // Mark purchase as invoiced and send emails
    await PurchaseService.updatePurchaseStatusInvoiced(purchaseId, createdInvoices.map(inv => inv._id), account);

  console.log(createdInvoices[0].items)
    
  // const csvData = createdInvoices.flatMap(invoice =>
  //   invoice.items.map(item => ({
  //     // InvoiceNumber: invoice.invoice_number,
  //     // ClientId: invoice.client.client_id,
  //     // IssueDate: invoice.issued_date,
  //     // DueDate: invoice.due_date,
  //     // Total: invoice.total,
  //     // Status: invoice.status,
  //     ItemName: item.name,
  //     ItemDescription: item.description,
  //     ItemQuantity: item.quantity,
  //     ItemPrice: item.price,
  //     ItemLineTotal: item.line_total,
  //     HSN: item.hsn,

  //   }))
  // );
    const csvData = purchase.items.map(item => ({
      name: item.itemId.name,
      description: item.itemId.description,
      quantity: item.quantity,
      pts: item.salePrice,
      ptr:item.costPrice,
      mrp:item.mrp,
      batchNo:item.batchNo,
      expiry:item.expDate,
      hsn:item.itemId.hsncode

    }));

  // Use json2csv to generate CSV
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(csvData);
  const csvBase64 = Buffer.from(csv).toString('base64');

    await InvoiceService.sendInvoices(
        createdInvoices.map(inv => inv._id),
        existingClient?.contact?.email,
        existingAccount.account_email,
        existingAccount.name,
        account,
        csvBase64
      );  

    res.status(201).json({
      message: `${createdInvoices.length} invoices created successfully`,
      data: createdInvoices,
    });
  } catch (error) {
    console.log(error);
    return sendErrorResponse(res, error.toString(), "Something went wrong", 500);
  }
};

export const  createAutomatedInvoice = async (req, res) =>{
  const { inputText } = req.body;

  if (!inputText) {
    return res.status(400).json({ error: 'Input text is required' });
  }

  console.log(inputText);

  try {
    
      const invoice = await UtilityService.parseInvoiceFromInput(inputText);
      // const invoice={
      //   client: 'aksh',
      //   due_date: '2022-02-28',
      //   currency: 'USD',
      //   invoice_number: 'st-5001',
      //   items: [ { name: 'Flutter App Development', price: 400 } ],
      //   notes: 'thanks for business'
      // }
    const account_id=req.user.account_id;
    const existingAccount = await Account.findById(account_id);
    if (invoice.client) {
        const client = await ClientService.findClientInDatabase(invoice.client,account_id);
        if (client) {
          // Notify user via WebSocket
          const message = `Found a closely matching client: ${client.name}. Do you want to use this client or create a new one?`;
          //socket.emit('prompt', { message, client });
  
          // Wait for the user's response (via WebSocket)
          // const userResponse = await new Promise((resolve) => {
          //     socket.on('clientResponse', resolve);
          // });
  
          // if (userResponse.useExisting) {
          //     // Use the existing client
          //     invoice.client = client._id;
          // } else {
          //     // Create a new client
          //     const newClient = await ClientService.createClient(invoice.client, account_id);
          //     invoice.client = newClient._id;
          // }
          console.log(message)
      }
      // emit message are u want create a new client ?
        console.log(client)
        invoice.client = client || null;
    }

    const issued_date = new Date();
    const due_date = new Date(issued_date);
    due_date.setDate(due_date.getDate() + 30);
    let newSerialNo,invoiceNumber,isUnique;
    if(invoice?.invoice_number){
       invoiceNumber=invoice?.invoice_number
       isUnique=await InvoiceService.isInvoiceNumberUnique(account_id, invoiceNumber);
       newSerialNo = InvoiceService.getSerialNumber(invoiceNumber);
    }

      if(!isUnique || !invoice?.invoice_number){
       
      const newInvoiceNumber = await InvoiceService.generateInvoiceNumber(account_id);
      newSerialNo=newInvoiceNumber.newSerialNo;
      invoiceNumber=newInvoiceNumber.invoiceNumber;
    }

    const items = await ItemService.processInvoiceItems(invoice.items,account_id);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    let taxTotal = 0;
    items.forEach(item => {
      if (item.itemId?.taxable) {
        const itemTaxTotal = item.itemId.taxes.reduce((sum, tax) => sum + (item.price * (tax.rate / 100)), 0);
        taxTotal += itemTaxTotal * item.quantity;
      }
    });
    const total = subtotal + taxTotal;
    const newInvoice = new Invoice({
      account:account_id,
      client:{client_id : invoice.client , billing_address:null,shipping_address:null},
      issued_date,
      due_date,
      serial_no: newSerialNo,
      invoice_number: invoiceNumber,
      currency: existingAccount?.currency,
      items,
      taxes:[
       
      ],
      subtotal,
      tax_total: taxTotal,
      total,
      notes: invoice?.notes || existingAccount?.invoiceSettings?.notes,
      terms: invoice?.terns || existingAccount?.invoiceSettings?.terms,
      status: 'Created',
      amount_due: total,
      created_by: req.user._id,
    });

    newInvoice.status_log.push({ status: 'Created', updated_on: Date.now() });

    const savedInvoice = await newInvoice.save();
    return res.status(200).json(savedInvoice)

  } catch (error) {
    console.error('Error interacting with OpenAI:', error);
    return res.status(500).json({ error: 'Failed to generate invoice. Please try again.' });
  }
}


