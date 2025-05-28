// eslint-disable-next-line import/prefer-default-export
export const paymentReminder = (invoice) => `<html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; }
          .header { text-align: left; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 24px; font-weight: bold; color: #333333; }
          .header p { margin: 4px 0; font-size: 16px; color: #333333; }
          .message { font-size: 14px; color: #666666; margin: 20px 0; padding: 15px; background-color: #f1f1f1; border-radius: 4px; text-align: left; }
          .amount { font-size: 18px; margin: 20px 0; font-weight: bold; text-align: left; }
          .button { display: block; width: 100%; text-align: center; margin: 20px 0; }
          .button a { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; }
          .footer { text-align: center; font-size: 12px; color: #aaaaaa; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
             <h1>Invoice from ${invoice.account.name}</h1>
            <p>Invoice ${invoice.invoice_number} • ${new Date(invoice.issued_date).toLocaleDateString()}</p>
          </div>
          <div class="amount">
            <div>Amount Due: ${invoice.currency.currency} ${invoice.total.toFixed(2)}</div>
            <div>Due Date:${new Date(invoice.due_date).toLocaleDateString()}</div>
          </div>
          <div class="message">
            
           <p> Dear ${invoice.client.client_id.name}</p><br>

<p>I hope this message finds you well. This is a friendly reminder that your payment for Invoice ${invoice.invoice_number} was due on ${new Date(invoice.due_date).toLocaleDateString()}.</p><br>

<p>We kindly ask you to process the payment by latest to avoid any late fees. Please let us know if you have any questions or need assistance with the payment process.</p><br>

<p>Thank you <p>
          </div>
         
        </div>
        <div class="footer">
          © 2024 10xtech. All rights reserved.
        </div>
      </body>
      </html>`;
