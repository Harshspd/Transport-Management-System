import Invoice from '../models/Invoice.mjs'; // Adjust the import path based on your folder structure
import AccountService from './AccountService.mjs';
import { sendEmail } from '../helpers/emailHelper.mjs';
import thankYouEmailToClient from '../email/paymentEmailTemplate.mjs';
import PdfGenerationService from './PdfGenerationService.mjs';
import UtilityService from './UtilityService.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import ClientService from './ClientService.mjs';
import ItemService from './ItemService.mjs';


class InvoiceService {
  // Method to create a new invoice
  async createInvoice(invoiceData) {
    try {
      const invoice = new Invoice(invoiceData);
      return await invoice.save();
    } catch (error) {
      throw new Error(`Error creating invoice: ${error.message}`);
    }
  }

  // Method to get all invoices
  async getAllInvoices() {
    try {
      return await Invoice.find();
    } catch (error) {
      throw new Error(`Error fetching invoices: ${error.message}`);
    }
  }

  // Method to get a single invoice by ID
  async getInvoiceById(accountId, invoiceId) {
    try {
      const invoice = await Invoice.findOne({ account: accountId, _id: invoiceId }).populate('client.client_id').populate('account').populate('currency');
      if (invoice) { return invoice; }
      throw new Error('Invoice Not Found');
    } catch (error) {
      throw new Error(`Error fetching invoice: ${error.message}`);
    }
  }

  // Method to update an invoice
  async updateInvoice(accountId, invoiceId, updateData) {
    try {
      return await Invoice.findOneAndUpdate(
        { _id: invoiceId, account: accountId },
        {
          $set: updateData,
          $push: {
            status_log: {
              status: 'Updated',
              updated_on: Date.now(),
            },
          },
        },
        { new: true },
      );
    } catch (error) {
      throw new Error(`Error updating invoice: ${error.message}`);
    }
  }

  // Method to delete an invoice
  async deleteInvoice(invoiceId) {
    try {
      return await Invoice.findByIdAndDelete(invoiceId);
    } catch (error) {
      throw new Error(`Error deleting invoice: ${error.message}`);
    }
  }

  async isInvoiceNumberUnique(accountId, invoiceNumber, invoiceId = null) {
    const invoice = await Invoice.findOne({
      invoice_number: invoiceNumber,
      account: accountId,
    });

    // case for self edit

    if (invoiceId && invoice && (invoiceId, (invoice._id).toString() === invoiceId)) {
      return true;
    }
    // this is case edit and add
    return !invoice;
  }

  getPrefix(invoiceNumber) {
    const match = invoiceNumber.match(/\d+$/);
    const lastDigits = match[0];
    const startIndex = invoiceNumber.lastIndexOf(lastDigits);
    return invoiceNumber.slice(0, startIndex);
  }

  getSerialNumber(invoiceNumber) {
    const match = invoiceNumber.match(/\d+$/); // Match digits at the end of the string
    if (match) {
      return match[0]; // Return the matched digits
    }
    throw new Error('Invalid Invoice Number Format');
  }

  addTransaction(invoice, type, date, amount) {
    invoice.transactions.push({
      type, date, amount, type,
    });
    return invoice;
  }

  async addPayment(accountId, invoiceId, date, amount,depositId ,type = 'payment') {
    let invoice = await this.getInvoiceById(accountId, invoiceId);
    invoice = this.addTransaction(invoice, 'payment', date, amount, type);

    const totalPayment = parseFloat(invoice.total_payment || 0) + parseFloat(amount);
    const amountDue = parseFloat(invoice.total || 0) - parseFloat(totalPayment);
    invoice.amount_due = amountDue;
    invoice.total_payment = totalPayment;

    invoice.updated_on = Date.now();
    if (invoice.amount_due <= 0) {
      invoice.status = 'Paid';
    } else {
      invoice.status = 'Partial Paid';
    }
    invoice.status_log.push({ status: invoice.status, updated_on: Date.now() });

    await invoice.save();
    const accountSettings=await AccountService.getAccountById(accountId)
    const cc =accountSettings.invoiceSettings?.invoice_cc||'';
    const bcc = accountSettings.invoiceSettings?.invoice_bcc||''
    const clientEmail = invoice.client?.client_id?.contact?.email;
    const htmlContent = thankYouEmailToClient(invoice, amount);
    if (clientEmail) { await sendEmail(clientEmail, 'Payment Confirmed', htmlContent, [], cc,bcc); }

    return invoice;
  }

  async editPayment(accountId, invoiceId, amount, _id) {
    const invoice = await this.getInvoiceById(accountId, invoiceId);
    const transactionIndex = invoice.transactions.findIndex(
      (t) => t._id.toString() === _id.toString(),
    );

    if (transactionIndex === -1) {
      throw new Error('Transaction not found');
    }

    const amountOld = invoice.transactions[transactionIndex].amount;
    invoice.transactions[transactionIndex] = {
      ...invoice.transactions[transactionIndex],
      ...{ amount, date: new Date(), type: 'payment' },
    };

    // Save the updated invoice

    const totalPayment = parseFloat(invoice.total_payment || 0) + parseFloat(amount) - parseFloat(amountOld);
    const amountDue = parseFloat(invoice.total || 0) - parseFloat(totalPayment);
    invoice.amount_due = amountDue;
    invoice.total_payment = totalPayment;

    invoice.updated_on = Date.now();
    if (invoice.amount_due <= 0) {
      invoice.status = 'Paid';
    } else {
      invoice.status = 'Partial Paid';
    }
    invoice.status_log.push({ status: invoice.status, updated_on: Date.now() });

    return await invoice.save();
  }

  async deletePayment(accountId, invoiceId, transactionId) {
    const invoice = await this.getInvoiceById(accountId, invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const transactionIndex = invoice.transactions.findIndex(
      (t) => t._id.toString() === transactionId.toString(),
    );

    if (transactionIndex === -1) {
      throw new Error('Transaction not found');
    }

    const amountToDelete = parseFloat(invoice.transactions[transactionIndex].amount) || 0;

    invoice.transactions.splice(transactionIndex, 1);

    const totalPayment = parseFloat(invoice.total_payment || 0) - parseFloat(amountToDelete);
    const amountDue = parseFloat(invoice.total || 0) - parseFloat(totalPayment);
    invoice.total_payment = totalPayment;
    invoice.amount_due = amountDue;

    // Update the status of the invoice based on the new amount due
    invoice.updated_on = Date.now();
    if (totalPayment <= 0) {
      invoice.status = 'Created';
    } else if (invoice.amount_due <= 0) {
      invoice.status = 'Paid';
    } else {
      invoice.status = 'Partial Paid';
    }

    // Add an entry to the status log
    invoice.status_log.push({ status: invoice.status, updated_on: Date.now() });

    // Save the updated invoice
    return await invoice.save();
  }

  async generateInvoiceNumber(account_id) {
    try {
      // Fetch account details to get the current prefix
      const account = await AccountService.getAccountById(account_id);
      const prefix = account?.invoiceSettings?.prefix || 'INV-';

      // Find the latest invoice for the account and get the highest serial number
      const invoice = await Invoice.findOne({
        account: account_id,
        invoice_number: { $regex: `^${prefix}` },
      })
        .sort({ serial_no: -1 });

      // Determine the next serial number
      const newSerialNo = (invoice && invoice.serial_no) ? invoice.serial_no + 1 : 1;
      // Pad the serial number to 4 digits
      const paddedNumber = newSerialNo.toString().padStart(4, '0');

      // Return the full invoice number and the serial number
      return { invoiceNumber: `${prefix}${paddedNumber}`, newSerialNo };
    } catch (error) {
      console.error('Error generating invoice number:', error);
      throw new Error('Error generating invoice number');
    }
  }

  async createSale(saleData) {
    try {
      // Create a new sale record
      const sale = await Sale.create(saleData);

      // Update stock for each item in the sale
      for (const item of saleData.items) {
        await this.updateStock(item.itemId, item.qty, sale.invoiceId, 'out'); // 'out' for sale
      }

      return sale;
    } catch (error) {
      throw new Error(`Error creating sale: ${error.message}`);
    }
  }

  async updateStock(itemId, qty, invoiceId, type) {
    try {
      // Find the stock ledger entry
      const stockEntry = await StockLedger.findOne({ item: itemId });

      if (!stockEntry) {
        throw new Error('Stock entry not found');
      }

      if (type === 'out') {
        // Handle stock removal (sale)
        stockEntry.transactions.push({
          type: 'out', qty, invoiceId, transactionDate: new Date(),
        });
        stockEntry.qty -= qty; // Update total quantity
      }

      // Save updated stock entry
      await stockEntry.save();
    } catch (error) {
      throw new Error(`Error updating stock: ${error.message}`);
    }
  }

  async sendInvoices(ids,email,accountEmail,accountName,account,csv) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const uploadFolder = path.join(__dirname, '../uploads');
  
    const attachments = [
      {
        filename: 'invoices_with_items.csv',
        content: csv,
        encoding: 'base64', 
      },
    ];
  
  
      for (const id of ids) {
        // Fetch invoice data for each ID
        const invoiceData = await PdfGenerationService.getInvoiceData(id);
        if (!invoiceData) {
          console.warn(`Invoice with ID ${id} not found.`);
          continue; // Skip if the invoice data isn't found
        }
  
        const htmlTemplatePath = path.join(__dirname, '..', 'documents', 'invoiceNew.hbs');
        const htmlString =  PdfGenerationService.getTemplate(invoiceData, htmlTemplatePath);
  
        // Generate the PDF
        const pdfFileName = `inv-wiz-version_${UtilityService.sanitizeFileName(invoiceData.invoice_number)}_${invoiceData._id}_${Date.now()}.pdf`;
        const { pdfFilePath, pdfBuffer } = await PdfGenerationService.generatePdfBufferByHTML(uploadFolder, htmlString, pdfFileName);
        fs.writeFileSync(pdfFilePath, pdfBuffer);
  
        // Add the PDF to attachments if successfully generated
        attachments.push({
          filename: path.basename(pdfFilePath),
          path: pdfFilePath,
        });
  
        // Update invoice status as 'Sent'
        const invoice = await Invoice.findOne({ _id: id, account });
        invoice.sent = true;
        invoice.updated_on = Date.now();
        invoice.status_log.push({ status: 'Sent', updated_on: Date.now() });
        await invoice.save();
      }
  
      // Prepare email content
      const htmlContent = `Please find attached your invoices.`;
      const cc = accountEmail;
  
      // Send the email with all PDFs attached
      await sendEmail(
        email,
        `Invoices from ${accountName}`,
        htmlContent,
        attachments,
        cc,
      );
    
  }
  
  async createAutomatedInvoice(invoice,account_id){
  
    try {
      
      const items = await ItemService.processAndValidateItems(invoice.items,account_id);
      const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  
      const issued_date = new Date();
      const due_date = new Date(issued_date);
      const currentDate = new Date();
      const billingPeriodStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const billingPeriodEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      due_date.setDate(due_date.getDate() + 30);
      let newSerialNo,invoiceNumber,isUnique;
      if(invoice?.invoice_number){
         invoiceNumber=invoice?.invoice_number
         isUnique=await this.isInvoiceNumberUnique(account_id, invoiceNumber);
         newSerialNo = this.getSerialNumber(invoiceNumber);
      }
  
        if(!isUnique || !invoice?.invoice_number){
         
        const newInvoiceNumber = await this.generateInvoiceNumber(account_id);
        newSerialNo=newInvoiceNumber.newSerialNo;
        invoiceNumber=newInvoiceNumber.invoiceNumber;
      }

    
      let taxTotal = 0; 
      items.forEach(item => {
        if (item.taxable) {
          const itemTaxTotal = item.itemTax.reduce((sum, tax) => sum + (item.price * (tax.rate / 100)), 0);
          taxTotal += itemTaxTotal * item.quantity;
        }
      });
      const existingAccount = AccountService.getAccountById(account_id);

      const total = subtotal + taxTotal;
      const newInvoice = new Invoice({
        account:account_id,
        client:{client_id : invoice.client , billing_address:null,shipping_address:null},
        issued_date,
        due_date,
        serial_no: newSerialNo,
        invoice_number: invoiceNumber,
        billingPeriodStart,
        billingPeriodEnd,
        currency:invoice.currency || existingAccount?.currency ,
        items,
        taxes:[
          ...Array.from(
            new Map(
              items.flatMap(item =>
                item.itemTax.map(tax => [
                  `${tax._id}_${tax.name}_${tax.rate}`,  // Unique key: tax_id + name + rate
                  {
                    tax_id: tax._id,
                    name: tax.name,
                    rate: tax.rate,
                    amount: item.price * (tax.rate / 100) * item.quantity,  // Calculated tax amount
                  }
                ])
              )
            ).values()  // Extract the unique tax objects
          )
        ],
        subtotal,
        tax_total: taxTotal,
        total,
        notes: invoice?.notes || existingAccount?.invoiceSettings?.notes,
        terms: invoice?.terns || existingAccount?.invoiceSettings?.terms,
        status: 'Created',
        language:'English',
        amount_due: total,
        created_by: account_id,
      });
  
      newInvoice.status_log.push({ status: 'Created', updated_on: Date.now() });
  
      return await newInvoice.save();
       
  
    } catch (error) {
      console.error('Error interacting with OpenAI:', error);
      throw Error({ error: 'Failed to generate invoice. Please try again.' });
    }
  }
  
  
}

export default new InvoiceService(); // Exporting an instance of the class
