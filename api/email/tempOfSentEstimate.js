export const estimateByMail = (estimate, name,clientMessage) => {
  const currencyType = estimate.currency ? estimate.currency.currency : '$';
    return `<html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; }
        .header { text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 4px 0; font-size: 14px; color: black; }
        .amount { font-size: 18px; margin: 20px 0; font-weight: bold; }
        .message { font-size: 14px; color: black; margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 4px; }
        .button { display: block; width: 100%; text-align: center; margin: 20px 0; }
        .button a { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; }
        .footer { text-align: center; font-size: 12px; color: black; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Estimate from 10xtech</h1>
          <p>Estimate ${estimate.estimate_number} • ${new Date(estimate.issued_date).toLocaleDateString()}</p>
        </div>

         <div class="message">
       
           ${clientMessage ? clientMessage : ` Dear ${name},<br> We appreciate the opportunity to work with you.`}
      </div>
        
        <div class="amount">
          Amount: ${currencyType} ${estimate.total.toFixed(2)}
        </div>



      </div>
      <div class="footer">
        © 2024 10xtech. All rights reserved.
      </div>
    </body>
    </html>`;
  };