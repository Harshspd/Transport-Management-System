
 export const invoiceByMail=(invoice, fromName, clientName, clientMessage)=>{
  const currencyType = invoice.currency ? invoice.currency.currency : '$';
  const formattedClientMessage = clientMessage
    ? clientMessage.replace(/\n/g, '<br>')
    : `<span class='client-span'>Dear ${clientName}</span>,  <br> We hope this message finds you well. Please find attached the invoice for the recent services provided.<br> Thanks for your business! `;


  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice from ${fromName}</title>
   <style>
        body {
            font-family: Arial, sans-serif;
            background-color: white;
            margin: 0;
            padding: 20px;
        }
        .client-span{
            font-weight:bold;
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
        .subheader  {
           font-size: 14px;
           text-align: center;
           font-weight: bold;
           padding-bottom: 10px;

        }


        .content {
            font-size: 16px;
            color: #555;
        }

        .content p {
            margin: 15px 0;
        }

        .important {
            font-size: 14px;
            font-weight: normal;
            margin: 20px 0;
            text-align: center;
            
        }

        .box-wrapper {
            justify-content: center;
            display:'flex';
            text-align: -webkit-center
        }
        .box-wrapper p{
            padding-bottom: 10px;
        }
        .invoice-details {
            background-color: #f1f8ff;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            margin-bottom: 20px;
            max-width: 80%
        }

        .invoice-details a {
            color: #1a73e8;
            text-decoration: none;
        }

        .invoice-details table {
            width: 100%;
            border-collapse: collapse;
        }

        .invoice-details th,
        .invoice-details td {
            text-align: left;
            padding: 8px;
            font-weight:700;
        }

        .invoice-details th {
            font-size: 14px;
            color: #333;
        }

        .invoice-details td {
            font-size: 14px;
            color: #555;
        }

        /* Footer styles */
        .footer {
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }

        .footer a {
            color: #1a73e8;
            text-decoration: none;
            margin: 0 10px;
            font-size: 14px;
        }

        .footer-icons {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 10px;
        }

        .footer-icons img {
            width: 24px;
            height: 24px;
        }

        .footer p {
            margin: 5px 0;
        }

        .text {
            max-width: 80%;
            text-align: left;
            line-height: 1.3;
            font-size: 14px
        }
    </style>
</head>

<body>

    <div class="header">
        <h1>Invoice From ${invoice?.account?.name}</h1>
    </div>
    <div class="container">
        <div class="content">
            
            <div class="box-wrapper">
                <div class="text"> 
                <p>
                    ${formattedClientMessage}
                </p>
                </div>
                <div class="invoice-details">
                    <table>
                        <tr>
                            <th>Name</th>
                            <td>${fromName}</td>
                        </tr>
                        <tr>
                            <th>Invoice number</th>
                            <td>${invoice.invoice_number}</td>
                        </tr>
                        <tr>
                            <th>Amount due</th>
                            <td> ${currencyType} ${invoice.amount_due.toFixed(2)}</td>
                        </tr>
                    </table>
                </div>
                <div class="text"> 
                    <p>
                        If you have any questions regarding this invoice or require additional details,
                        feel free to reach out to us at ${invoice?.account?.account_email} or call us at ${invoice?.account?.mobile}.
                    </p>
                    <p>
                        Thank you for your prompt attention to this matter.
                    </p>
                    <p>
                        Best regards,
                    </p>
                    <p>
                        Team ${invoice?.account?.name}
                    </p>
                </div>
            </div>
           
        </div>

        <!-- Footer Section -->
    </div>
    <div class="footer">
        <p class="important"><b>Disclaimer:</b> This is a system-generated email and does not require a signature. This communication is in compliance with the provisions of the Information Technology Act, 2000 and its amendments.</p>
        <p>Kandivali, Mumbai 400101,India</p>
        <p> © 2024 10xtech. All rights reserved.</p>
        
    </div>

</body>

</html>`
}