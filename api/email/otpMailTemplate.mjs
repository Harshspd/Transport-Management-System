export const otpByMail = (otp) => {
    return `<html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f8f9fa;color:#000000}
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; }
        .header { text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 4px 0; font-size: 14px; color: #888888; }
        .otp { font-size: 18px; margin: 20px 0; font-weight: bold; }
        .message { font-size: 14px; color: #666666; margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 4px; }
        .button { display: block; width: 100%; text-align: center; margin: 20px 0; }
        .button a { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; }
        .footer { text-align: center; font-size: 12px; color: #aaaaaa; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>OTP Verification</h1>
          <p>Your One-Time Password (OTP)</p>
        </div>
        
        <div class="otp">
          Your OTP: ${otp}
        </div>
  
        <div class="message">
          Please use the above OTP to complete your verification. This OTP is valid for  5 minutes only.
        </div>
  
      </div>
      <div class="footer">
        © 2024 10xtech. All rights reserved.
      </div>
    </body>
    </html>`;
  };
  