const creditNoteByMail = (invoice) => {
  const currencyType = invoice.currency ? invoice.currency.currency : '$';
  const itemRows = invoice.items.map((item) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #dddddd;">${item.name || item.description}</td>
      <td style="padding: 8px; border: 1px solid #dddddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #dddddd; text-align: right;">${currencyType}${item.price?.toFixed(2)}</td>
      <td style="padding: 8px; border: 1px solid #dddddd; text-align: right;">${currencyType}${item.line_total?.toFixed(2)}</td>
    </tr>
  `).join('');

  return `<html>
  <head>
    <style>
      body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa; }
    </style>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
      <div style="text-align: left; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: black;">Credit Note from ${invoice.account?.name}</h1>
        <p style="margin: 4px 0; font-size: 16px; color: #333333;">Credit Note Number: ${invoice.credit_note_no}</p>
        <p style="margin: 4px 0; font-size: 16px; color: #333333;">Date of Issue: ${new Date(invoice.issued_date).toLocaleDateString()}</p>
      </div>

      <div style="font-size: 14px; margin-bottom: 20px;">
        <h3 style="margin-bottom: 8px;">Seller Information:</h3>
        <p style="margin: 4px 0;">Company Name: ${invoice.account.name}</p>
        <p style="margin: 4px 0;">Address: ${invoice?.account.address?.address_line1 || 'N/A'}, ${invoice.account?.address?.city}</p>
        <p style="margin: 4px 0;">Phone: ${invoice?.account?.mobile || 'N/A'}</p>
        <p style="margin: 4px 0;">Email: ${invoice?.account?.account_email || 'N/A'}</p>
        <p style="margin: 4px 0;">Tax ID/VAT Number: ${invoice?.account?.tax_id || 'N/A'}</p>
      </div>

      <div style="font-size: 14px; margin-bottom: 20px;">
        <h3 style="margin-bottom: 8px;">Buyer Information:</h3>
        <p style="margin: 4px 0;">Customer Name: ${invoice?.client?.client_id?.name}</p>
        <p style="margin: 4px 0;">Address: ${invoice?.client?.client_id?.address?.address_line_1}, ${invoice?.client?.client_id?.address?.city || 'N/A'}</p>
        <p style="margin: 4px 0;">Phone: ${invoice?.client?.client_id?.contact?.mobile || 'N/A'}</p>
        <p style="margin: 4px 0;">Email: ${invoice?.client?.client_id?.contact?.email || 'N/A'}</p>
        <p style="margin: 4px 0;">Tax ID/VAT Number: ${invoice?.client?.client_id?.address?.tax_id || 'N/A'}</p>
      </div>

      <div style="font-size: 14px; margin-bottom: 20px;">
        <h3 style="margin-bottom: 8px;">Original Invoice Reference:</h3>
        <p style="margin: 4px 0;">Invoice Number: ${invoice.invoice_number}</p>
        <p style="margin: 4px 0;">Invoice Date: ${new Date(invoice.issued_date).toLocaleDateString()}</p>
      </div>

      <h3 style="margin-bottom: 8px;">Description of Goods/Services:</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="padding: 8px; border: 1px solid #dddddd; text-align: left;">Item Description</th>
            <th style="padding: 8px; border: 1px solid #dddddd; text-align: center;">Quantity</th>
            <th style="padding: 8px; border: 1px solid #dddddd; text-align: right;">Unit Price</th>
            <th style="padding: 8px; border: 1px solid #dddddd; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <div style="font-size: 18px; font-weight: bold; text-align: right; line-height: 1.6; letter-spacing: 0.5px; margin-top: 20px; margin-bottom: 10px;">
        Subtotal: ${currencyType}${invoice.subtotal?.toFixed(2)}<br>
        Tax (if applicable): ${currencyType}${invoice.tax_total?.toFixed(2)}<br>
        Total Credit Amount: ${currencyType}${invoice.total?.toFixed(2)}
      </div>

      <div style="font-size: 14px; margin-bottom: 20px;">
        <h3 style="margin-bottom: 8px;">Reason for Credit Note:</h3>
        <p style="margin: 4px 0;">${invoice.notes || 'N/A'}</p>
      </div>

      <div style="font-size: 14px; margin-bottom: 20px;">
        <h3 style="margin-bottom: 8px;">Notes:</h3>
        <p style="margin: 4px 0;">${invoice.terms || 'N/A'}</p>
      </div>
    </div>
    <div style="text-align: center; font-size: 12px; color: #aaaaaa; margin-top: 20px;">
      © 2024 10xtech. All rights reserved.
    </div>
  </body>
  </html>`;
};

export default creditNoteByMail;
