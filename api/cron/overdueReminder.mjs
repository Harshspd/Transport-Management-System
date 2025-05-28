import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";

import Invoice from "../models/Invoice.mjs";

import { sendEmail } from "../helpers/emailHelper.mjs";
import { paymentReminder } from "../email/paymentReminder.mjs";
import { generateAttachmentUrl } from "../helpers/generateAttachment.js";

// Manually create __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables

// Helper function to send reminder emails
const sendReminderEmails = async (invoices) => {
  console.log("Preparing to send reminder emails...");

  await Promise.all(
    invoices.map(async (invoice) => {
      console.log(`Processing invoice ID: ${invoice._id}`);

      const client = invoice.client.client_id;

      if (!client) {
        console.warn(`No client associated with invoice ID: ${invoice._id}`);
      }
      const clientEmail = client.contact.email;
      console.log(`Client email: ${clientEmail}`);

      const attachmentPath = await generateAttachmentUrl(
        invoice.invoice_number
      );

      console.log(`Attachment path: ${attachmentPath}`);

      let attachments = [];

      if (attachmentPath) {
        const attachmentFile = path.basename(attachmentPath);

        attachments.push({
          filename: attachmentFile,
          path: attachmentPath,
        });
        console.log("Attachment found and will be sent with the email.");
      } else {
        console.warn("No attachment found to send with the email.");
      }

      // Get account email or use the default email
      const accountEmail =
        invoice.account.account_email || process.env.DefaultEmail;

      const htmlContent = paymentReminder(invoice);

      try {
        await sendEmail(
          clientEmail,
          "Payment Reminder",
          htmlContent,
          attachments,
          accountEmail
        );

        // Update the invoice with the date the email was sent
        await Invoice.findByIdAndUpdate(invoice._id, {
          last_email_sent: new Date(),
        });
      } catch (error) {
        console.error(
          `Error sending email for invoice ${invoice._id}:`,
          error.message
        );
      }
    })
  );
};

// Main function to fetch and process invoices
const processInvoices = async () => {
  try {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0); // Set time to midnight (00:00:00.000) in UTC
    const formattedDate = currentDate.toISOString(); // Get the date in ISO 8601 format

    // console.log("Formatted date:", formattedDate);

    // Calculate the date 2 days ago and 15 days ago
    const twoDaysAgo = new Date(
      currentDate.getTime() - 2 * 24 * 60 * 60 * 1000
    );
    const fifteenDaysAgo = new Date(
      currentDate.getTime() - 15 * 24 * 60 * 60 * 1000
    );
    console.log("2 days ago:", twoDaysAgo);
    console.log("15 days ago:", fifteenDaysAgo);

    // Find overdue invoices that need to be reminded
    const invoices = await Invoice.find({
      reminder_invoice: true,
      amount_due: { $gt: 100 },
      due_date: { $lt: formattedDate },
      archived: { $ne: true }, // Ensure invoice is not archived
      $or: [
        {
          last_email_sent: { $exists: false },
          due_date: { $lt: twoDaysAgo }, // Newly overdue invoices
        },
        {
          last_email_sent: { $lt: fifteenDaysAgo }, // Existing overdue invoices
          due_date: { $lt: formattedDate },
        },
      ],
    })
      .populate("client.client_id")
      .populate("account")
      .populate("currency");

    // console.log("Fetched Invoices:", invoices);

    if (invoices.length === 0) {
      console.log("No invoices found matching the criteria.");
    }

    // Send emails for these invoices
    await sendReminderEmails(invoices);
    console.log("Reminder emails processing complete.");
  } catch (error) {
    console.error("Error in processInvoices function:", error.message);
  }
};
export default processInvoices;
