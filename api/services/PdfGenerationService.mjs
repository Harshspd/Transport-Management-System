import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import pdf from 'html-pdf';
import puppeteer from 'puppeteer';
import Invoice from '../models/Invoice.mjs';
import Estimate from '../models/Estimate.mjs';
import { formatDate } from '../helpers/utililty.mjs';


class PdfGenerationService {

  async getInvoiceData(id) {
    try {
      const invoiceData = await Invoice.findOne({ _id: id })
        .populate({
          path: 'account',
          populate: {
            path: 'address',
            populate: { path: 'country_id' },
          },
        })
        .populate({
          path: 'client.client_id',
          populate: { path: 'address' },
        })
        .populate('client.billing_address')
        .populate('client.shipping_address')
        .populate('currency')
        .populate({
          path: 'items.item',
          populate: { path: 'taxes' },
        })
        .populate({
          path: 'items.itemTax', // Populate the itemTax array for each item
        })
        .populate('taxes')
        .lean()
        .exec();

      return invoiceData;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw new Error('Could not fetch invoice data');
    }
  };
  getTemplate(data, htmlTemplatePath) {
    // Read the template file
    const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');

    // Compile the Handlebars template
    const template = handlebars.compile(htmlTemplate);

    // Register the helper to format floating-point numbers
    handlebars.registerHelper('default', function (value, fallback) {
      return value != null ? value : fallback;
    });
    handlebars.registerHelper('calculateColspan', function (taxCount) {
      const baseColumns = 10; 
      const taxColumns = taxCount * 2; 
      const totalColumns = baseColumns + taxColumns + 1;
      return totalColumns
    });
    handlebars.registerHelper('add', function(a, b) {
      return a + b;
  });
    handlebars.registerHelper('formateDate', (value) => value && new Date(value).toLocaleDateString());
    handlebars.registerHelper('formatFloat', (value) => parseFloat(value).toFixed(2));
    handlebars.registerHelper('breakLines', (text) => {
      return text.replace(/\n/g, '<br>');
    });
    // Format the dates in the transactions array
    const formattedTransactions = data?.transactions ? data.transactions.map((transaction) => ({
      ...transaction,
      date: formatDate(transaction.date),
    })) : [];

    // Construct the data conditionally
    const dataContext = {
      ...data,
      issued_date: formatDate(data.issued_date),
      due_date: formatDate(data.due_date),
    };

    // Add transactions only if they are present
    if (data.transactions && data.transactions.length > 0) {
      dataContext.transactions = formattedTransactions;
    }

    //add tax
    dataContext.items.forEach(item => {
      let totalTaxAmount = 0;

      // Calculate the tax amount for each tax in itemTax
      dataContext.items.forEach(item => {
        let totalTaxAmount = 0;

        // Calculate the tax amount for each tax in itemTax
        item.itemTaxAmounts = item.itemTax.map(tax => {
          const taxAmount = (item.price * item.quantity * tax.rate) / 100;
          totalTaxAmount += taxAmount;
          return {
            name: tax.name,
            rate: tax.rate,
            amount: taxAmount.toFixed(2), // Format for currency display
          };
        });

        // Add the total tax amount and the combined total (line_total + tax)
        item.totalTaxAmount = totalTaxAmount.toFixed(2);
        item.itemwiseTotalWithTax = (item.line_total + totalTaxAmount).toFixed(2);
      });
      // Add the total tax amount to the item
      item.totalTaxAmount = totalTaxAmount.toFixed(2);
      item.totalWithTax = (item.line_total + totalTaxAmount).toFixed(2);
    });

    // Add the formatted data to the Handlebars context
    const context = {
      data: dataContext,
      account: data.account,
    };

    // Generate the HTML string by applying the context to the template
    const replacedHtml = template(context);

    return replacedHtml;
  };


  async generatePdf(replacedHtml, invoice) {
    const pdfOptions = {
      format: 'A4',
      border: {
        top: '10px',
        right: '10px',
        bottom: '10px',
        left: '10px',
      },
      footer: {
        height: '20mm', // Increased height for better visibility
        contents: {
          default: `
                <div style="text-align: center; font-size: 10px; padding: 10px;">
                  ${invoice.account.site_url} | ${invoice.account.account_email} | Page {{page}} of {{pages}}
                </div>
              `,
        },
      },

    };

    return new Promise((resolve, reject) => {
      pdf.create(replacedHtml, pdfOptions).toStream((err, stream) => {
        if (err) {
          console.error('Error generating PDF:', err);
          reject('Failed to generate PDF');
        } else {
          resolve(stream);
        }
      });
    });
  };

  async generatePdfBufferByHTML(uploadFolder, htmlString, pdfFileName) {
    const pdfFilePath = path.join(uploadFolder, pdfFileName);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.setContent(htmlString, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      pageBreak: 'after',
      printBackground: true,
      margin: {
        top: '70px',
        right: '20px',
        left: '20px',
        bottom: '70px'
      },
      displayHeaderFooter: true,
      headerTemplate: `<div style="width: 100%; height: 100%; text-align: center; font-size: 10px; color: grey; display: flex; justify-content: center; align-items: center;">
      <h1 style="text-align: center;">Tax Invoice (Page <span class="pageNumber"></span>)</h1></div>`,
      footerTemplate: `
      <div style="width: 100%; height: 100%; text-align: center; font-size: 10px;  color: grey; display: flex; justify-content: center; align-items: center;">
        <div>
          Thank you for your business
          <br/><br/>
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      </div>
    `


    });

    await browser.close();
    return ({ pdfFilePath, pdfBuffer });
  };
  async getEstimateData(id) {
    try {
      const object = await Estimate.findOne({ _id: id })
        .populate({
          path: 'account',
          populate: {
            path: 'address',
            populate: { path: 'country_id' },
          },
        })
        .populate({
          path: 'client.client_id',
          populate: { path: 'address' },
        })
        .populate('client.billing_address')
        .populate('client.shipping_address')
        .populate('currency')
        .populate({
          path: 'items.item',
          populate: { path: 'taxes' },
        })
        .populate('taxes.tax_id')
        .lean()
        .exec();
      return object;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw new Error('Could not fetch invoice data');
    }
  };



}

export default new PdfGenerationService();

