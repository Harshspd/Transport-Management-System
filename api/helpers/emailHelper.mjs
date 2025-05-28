import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

export const sendEmail = async (to, subject, htmlContent, attachments = [], cc,bcc ) => {
  if(process.env.EMAIL_DISABLED==='true'){
    console.warn('EMAIL DISABLED:Email Not Sent')
    return;
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    cc,
    subject,
    html: htmlContent,
    attachments,
    bcc
  };

  await transporter.sendMail(mailOptions);
};
