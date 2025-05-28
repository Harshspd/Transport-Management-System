 const thankYouEmailToClient = (invoice, amount) => {
  const currencyType = invoice.currency ? invoice.currency.currency : '$';
  
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: white;
            margin: 0;
            padding: 20px;
        }

        .container {
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
        }

        .header {
            text-align: center;
        }

        .header h1 {
            font-size: 24px;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 0.67em;
        }

        .content {
            font-size: 16px;
            color: #555;
        }

        .content p {
            margin: 15px 0;
        }

        .payment-details {
            background-color: #f1f8ff;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            margin-bottom: 20px;
            max-width: 80%;
        }

        .payment-details table {
            width: 100%;
            border-collapse: collapse;
        }

        .payment-details th,
        .payment-details td {
            text-align: left;
            padding: 8px;
            font-weight: 700;
        }

        .footer {
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Payment Confirmation for ${invoice.invoice_number}</h1>
    </div>
    <div class="container">
        <div class="content">
            <p>Dear ${invoice.client?.client_id?.name},</p>
            <p>We are pleased to inform you that we have received your payment of <strong>${currencyType} ${amount}</strong> for Invoice Number <strong>${invoice.invoice_number}</strong> dated <strong>${new Date(invoice.issued_date).toLocaleDateString()}</strong>.</p>
            <p>Thank you for your prompt payment. Your support and trust in our services are greatly appreciated.</p>
            
            <div class="payment-details">
                <table>
                    <tr><th>Invoice Number</th><td>${invoice.invoice_number}</td></tr>
                    <tr><th>Invoice Date</th><td>${new Date(invoice.issued_date).toLocaleDateString()}</td></tr>
                    <tr><th>Payment Amount</th><td>${currencyType} ${amount}</td></tr>
                    <tr><th>Payment Date</th><td>${new Date().toLocaleDateString()}</td></tr>
                </table>
            </div>
            
            <p>If you have any questions or need further assistance, please feel free to contact us at <a href="mailto:${invoice.account.account_email}">${invoice.account.account_email}</a> or reach out to your account manager directly.</p>
            <p>We look forward to serving you again!</p>
            
            <p>Best Regards,</p>
            <p>Team ${invoice.account.name}</p>
        </div>
    </div>
     <div class="footer">
        <p class="important"><b>Disclaimer:</b> This is a system-generated email and does not require a signature. This communication is in compliance with the provisions of the Information Technology Act, 2000 and its amendments.</p>
        <p>Kandivali, Mumbai 400101,India</p>
        <p> © 2024 10xtech. All rights reserved.</p>
        
    </div>
</body>
</html>`;
};
export default thankYouEmailToClient;