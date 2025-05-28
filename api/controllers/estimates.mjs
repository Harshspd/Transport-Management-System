// TODO : Remove extra references
// TODO : Remove unused code
import mongoose from 'mongoose';
import { Parser } from 'json2csv';
import moment from 'moment';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import Account from '../models/Account.mjs';
import Estimate from '../models/Estimate.mjs';
import Client from '../models/Client.mjs';
import { sendEmail } from '../helpers/emailHelper.mjs';
import { estimateByMail } from '../email/tempOfSentEstimate.js';
import { ExtractPrefixAndSerialNo, formatDate, generateEstimateNumber, sanitizeFileName } from '../helpers/utililty.mjs';
import { generatePdfBufferByHTML, getEstimateData, getTemplate } from '../helpers/templateHelper.mjs';
import UtilityService from '../services/UtilityService.mjs';

// eslint-disable-next-line import/prefer-default-export
export const createEstimate = async (req, res) => {
  const {
    account,
    client,
    issued_date,
    due_date,
    currency,
    language,
    estimate_number,
    reference_number,
    items,
    discounts,
    taxes,
    subtotal,
    total,
    notes,
    terms,
    attachments,
    status,
    archived,
    invoiced,
    sent,
    created_by,
    updated_by,
  } = req.body;

  try {
    if (account !== req.user.account_id) { return res.status(401).json({ message: 'Unauthorized:Account id Mismatch' }); }
    // Check if account is present
    if (!account) {
      return res.status(400).json({ message: 'Account is required' });
    }

    //  Validate account ID
    if (!mongoose.Types.ObjectId.isValid(account)) {
      return res.status(400).json({ message: 'Invalid account ID' });
    }

    const existingAccount = await Account.findById(account);
    if (!existingAccount) {
      return res.status(400).json({ message: 'Account not found' });
    }

    let clientId = null;
    let existingClient = null;

    // Check if client_id is provided
    if (client && client.client_id) {
      if (!mongoose.Types.ObjectId.isValid(client.client_id)) {
        return res.status(400).json({ message: 'Invalid client ID' });
      }

      existingClient = await Client.findById(client.client_id);
      if (existingClient) {
        clientId = client.client_id;
      }
    }

    // Check if estimate_number already exists
    const existingEstimate = await Estimate.findOne({ estimate_number, account: req.user.account_id });
    if (existingEstimate) {
      return res.status(400).json({ error: 'Estimate number already exists' });
    }
    // Create estimate object
    const newEstimate = new Estimate({
      account,
      client: {
        client_id: clientId,
        billing_address: client.billing_address || null,
        shipping_address: client.shipping_address || null,
      },
      issued_date,
      due_date,
      currency,
      language,
      reference_number,
      items,
      discounts,
      taxes,
      subtotal,
      total,
      notes,
      terms,
      attachments,
      status: 'Created',
      archived,
      invoiced,
      sent,
      created_by,
      updated_by,
    });
    if (!estimate_number) return res.status(400).json({ message: 'Estimate Number should not be blank' });
    const { serialNo, prefix } = ExtractPrefixAndSerialNo(estimate_number);
    await Account.findByIdAndUpdate(
      req.user.account_id,
      { 'estimateSettings.prefix': prefix },
      { new: true, runValidators: true },
    );
    const existingEstimateaWithSerialNo = await Estimate.findOne({
      serial_no: serialNo,
      account: req.user.account_id,
    });

    newEstimate.serial_no = serialNo; 
    if (existingEstimateaWithSerialNo) {
      const { newSerialNo } = await generateEstimateNumber(req.user.account_id);
      newEstimate.serial_no=newSerialNo
    }
    newEstimate.estimate_number= estimate_number
    newEstimate.status_log.push({ updated_on: Date.now(), status: 'Created' });
    await newEstimate.save();

    // Instead of saving, you return the new estimate object
    res.status(201).json({
      message: 'Estimate created successfully',
      data: newEstimate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating estimate', error });
  }
};

export const getEstimateById = async (req, res) => {
  const { id } = req.params;

  try {
    const estimate = await Estimate.findOne({ _id: id, account: req.user.account_id })
      .populate({
        path: 'account',
        populate: {
          path: 'address',
          populate: {
            path: 'country_id',
            model: 'Country',
          },
        },
      })
      .populate('client.client_id')
      .populate('client.billing_address')
      .populate('client.shipping_address')
      .populate('currency')
      .populate('items.item')
      .populate('taxes.tax_id')
      .exec();
      // .populate('created_by')
      // .populate('updated_by')

    if (!estimate) {
      return res.status(400).json({ message: 'Estimate not found' });
    }

    res.status(200).json({ message: 'Estimate retrieved successfully', data: estimate });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving estimate', error });
  }
};

export const getEstimates = async (req, res) => {
  try {
    let query = Estimate.find({ archived: false, account: req.user.account_id })
      .populate('client.client_id')
      .populate('currency')
      .sort({ created_on: -1 });

    if (req.query.latest === 'true') {
      query = query.limit(10);
    }

    const estimates = await query.exec();
    res.status(200).json({ message: 'Estimates retrieved successfully', data: estimates });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving estimates', error });
  }
};

export const updateEstimate = async (req, res) => {
  try {
    const estimateId = req.params.id;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(estimateId)) {
      return res.status(400).json({ message: 'Invalid estimate ID' });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Update data is required' });
    }

    const existingEstimate = await Estimate.findOne({ _id: estimateId, account: req.user.account_id });

    if (!existingEstimate) {
      return res.status(404).json({ error: 'Estimate not found' });
    }

    if (existingEstimate.status !== 'Unapproved' && existingEstimate.status !== 'Created') {
      return res.status(403).json({ error: 'Only unapproved or New estimates can be edited' });
    }

    Object.keys(updateData).forEach((key) => {
      existingEstimate[key] = updateData[key];
    });
    existingEstimate.status_log.push({ updated_on: Date.now(), status: 'Updated' });
    const updatedEstimate = await existingEstimate.save();

    return res.status(200).json({
      message: 'Estimate updated successfully',
      estimate: updatedEstimate,
    });
  } catch (err) {
    console.error('Error updating estimate:', err);
    return res.status(500).json({ error: err.message, message: 'Internal server error' });
  }
};

export const approveEstimate = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid estimate ID' });
    }

    const updatedEstimate = await Estimate.findOneAndUpdate(
      { _id: id, account: req.user.account_id },
      {
        $set: { status: 'Approved' },
        $push: {
          status_log: {
            updated_on: Date.now(),
            status: 'Approved',
          },
        },
      },
      { new: true },
    );

    if (!updatedEstimate) {
      return res.status(400).json({ message: 'Estimate not found' });
    }

    res.status(200).json({ message: 'Estimate approved successfully', data: updatedEstimate });
  } catch (error) {
    res.status(500).json({ message: 'Error approving estimate', error });
  }
};

export const deleteEstimate = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid estimate ID' });
    }

    const estimate = await Estimate.findOneAndDelete({ _id: id, account: req.user.account_id });
    if (!estimate) {
      return res.status(400).json({ message: 'Estimate not found' });
    }

    res.status(200).json({
      message: 'Estimate deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting estimate:', error);
    res.status(500).json({ message: 'Error deleting estimate', error: error.message });
  }
};

export const toggleArchiveEstimate = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid estimate ID' });
    }
    const updatedEstimate = await Estimate.findOneAndUpdate(
      { _id: id, account: req.user.account_id },
      [{ $set: { archived: { $eq: [false, '$archived'] } } }],
      { new: true },
    );

    if (!updatedEstimate) {
      return res.status(404).json({ message: 'Estimate not found' });
    }

    res.status(200).json({
      message: `Estimate ${updatedEstimate.archived ? 'archived' : 'unarchived'} successfully`,
      data: updatedEstimate,
    });
  } catch (error) {
    console.error('Error toggling archive status of estimate:', error);
    res.status(500).json({ message: 'Error toggling archive status of estimate', error: error.message });
  }
};

export const searchEstimateByClientName = async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: 'Name query parameter is required' });
  }

  try {
    const estimates = await Estimate.aggregate([
      {
        $lookup: {
          from: 'clients',
          localField: 'client.client_id',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $unwind: '$client',
      },
      {
        $match: {
          'client.name': { $regex: new RegExp(name, 'i') },
          account: new mongoose.Types.ObjectId(req.user.account_id), // Convert to ObjectId
        },
      },
    ]);
    if (estimates.length === 0) {
      return res.status(404).json({ message: 'No estimates found for the given client name' });
    }

    res.status(200).json({ message: 'Estimates retrieved successfully', data: estimates });
  } catch (error) {
    console.error('Error searching for estimates:', error);
    res.status(500).json({ message: 'Error searching for estimates', error });
  }
};

export const transformOutput = (query) => query
  .populate('client.client_id')
  .populate('currency');
export const getArchivedEstimates = async (req, res) => {
  try {
    // Find all estimates where the archived field is true
    const archivedEstimates = await transformOutput(Estimate.find({ archived: true, account: req.user.account_id })).exec();

    // Respond with the retrieved archived estimates
    res.status(200).json({ message: 'Archived estimates retrieved successfully', data: archivedEstimates });
  } catch (error) {
    console.error('Error retrieving archived estimates:', error);
    res.status(500).json({ message: 'Error retrieving archived estimates', error });
  }
};

export const exportEstimatesToCSV = async (req, res) => {
  try {
    const { fieldsToInclude } = req.body; // Assuming fieldsToInclude is an array of selected field names

    // Find all estimates and populate the client details
    const estimates = await transformOutput(Estimate.find({ account: req.user.account_id })).exec();

    // Extract the required fields based on user selection
    const csvData = estimates.map((estimate) => {
      const client = estimate.client.client_id;
      const data = {
        Estimate_Number: estimate.estimate_number,
        Issue_dDate: moment(estimate.issued_date).format('M/D/YYYY'),
        Due_Date: moment(estimate.due_date).format('M/D/YYYY'),
        Status: estimate.status,
        Client_Name: client ? client.name : '',
        Client_Email: client && client.contact ? client.contact.email : '',
        Currency: estimate && estimate.currency ? estimate.currency.currency : '',
        Total: estimate.total,
        isArchived: estimate.archived,
      };

      // Filter out fields not included in the selection
      const filteredData = {};
      fieldsToInclude.forEach((field) => {
        if (data.hasOwnProperty(field)) {
          filteredData[field] = data[field];
        }
      });

      return filteredData;
    });

    // Convert the data to CSV
    const json2csvParser = new Parser({ fields: fieldsToInclude });
    const csv = json2csvParser.parse(csvData);

    // Set the response headers to indicate a file attachment
    res.header('Content-Type', 'text/csv');
    res.attachment('all_estimates.csv');
    return res.send(csv);
  } catch (error) {
    console.error('Error exporting estimates to CSV:', error);
    return res.status(500).json({ message: 'Error exporting estimates to CSV', error });
  }
};

// export const getEstimateNumber = async (req, res) => {
//   try {
//     const count = await Estimate.countDocuments();
//     res.json({ count });
//   } catch (error) {
//     console.error('Error fetching estimate count:', error);
//     res.status(500).json({ message: 'Error fetching estimate count', error });
//   }
// };
export const getEstimateNumber = async (req, res) => {
  try {
    const { estimateNumber, newSerialNo } = await generateEstimateNumber(req.user.account_id);
    res.json({ estimateNumber, serial_no: newSerialNo });
  } catch (error) {
    console.error('Error fetching max Estimate number:', error);
    res.status(500).json({ message: 'Error fetching max Estimate number', error });
  }
};

export const invoiceEstimate = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid estimate ID' });
    }
    const estimate = await Estimate.findOneAndUpdate(
      { _id: id, account: req.user.account_id },
      {
        $set: { invoiced: true, status: 'Invoiced' },
        $push: {
          status_log: {
            updated_on: Date.now(),
            status: 'Invoiced',
          },
        },
      },
      { new: true },
    );

    if (!estimate) {
      return res.status(404).json({ message: 'Estimate not found' });
    }

    return res.status(200).json({
      message: 'Estimate invoiced successfully',
      data: estimate,
    });
  } catch (error) {
    // Log and respond with an error message
    console.error('Error invoicing estimate:', error);
    return res.status(500).json({ message: 'Failed to invoice estimate', error: error.message });
  }
};

export const getEstimatePdf = async (req, res) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const uploadFolder = path.join(__dirname, '../uploads');

  try {
    const { id } = req.params;
    const {mode}=req.query;
    const estimate = await getEstimateData(id);

    if (!estimate) {
      return res.status(404).json({ error: 'Estimate not found' });
    }

    const htmlTemplatePath = path.join(__dirname, '..', 'documents', 'sampleTemplate.hbs');
    const htmlString = await getTemplate(estimate, htmlTemplatePath);
    const pdfFileName = `inv-wiz-version_${sanitizeFileName(estimate.estimate_number)}_${estimate._id._id}_${Date.now()}.pdf`; // File name according
    const { pdfFilePath, pdfBuffer } = await generatePdfBufferByHTML(uploadFolder, htmlString, pdfFileName);
    fs.writeFileSync(pdfFilePath, pdfBuffer);

    if (mode === 'view') {
      // Save the file

      // Set headers for inline display
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=' + pdfFileName);

      // Send the file
      res.sendFile(pdfFilePath, (err) => {
        // Delete the file after sending
        fs.unlink(pdfFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting the PDF file:', unlinkErr);
          } else {
            console.log('PDF file deleted successfully');
          }
        });

        if (err) {
          console.error('Error sending the PDF file:', err);
          res.status(500).json({ error: 'Failed to send PDF file' });
        } else {
          console.log('PDF file sent successfully');
        }
      });
    } else {
      // Save the PDF file to disk

      // Send the file as a download or other mode
      res.sendFile(pdfFilePath, (err) => {
        if (err) {
          console.error('Error sending the PDF file:', err);
          res.status(500).json({ error: 'Failed to send PDF file' });
        } else {
          console.log('PDF file sent successfully');
        }
      });
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF', err: error });
  }
};

export const sendEstimateAndMarkSent = async (req, res) => {
  const { id } = req.params;
  const { email, clientName, clientMessage } = req.body;
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const uploadFolder = path.join(__dirname, '../uploads');


  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid estimate ID' });
    }

    const estimate = await getEstimateData(id);

    if (!estimate) {
      return res.status(404).json({ error: 'Estimate not found' });
    }

    const htmlTemplatePath = path.join(__dirname, '..', 'documents', 'sampleTemplate.hbs');
    const htmlString = await getTemplate(estimate, htmlTemplatePath);
    const pdfFileName = `inv-wiz-version_${sanitizeFileName(estimate.estimate_number)}_${estimate._id._id}_${Date.now()}.pdf`; // File name according
    const { pdfFilePath, pdfBuffer } = await generatePdfBufferByHTML(uploadFolder, htmlString, pdfFileName);
    fs.writeFileSync(pdfFilePath, pdfBuffer);

    const htmlContent = estimateByMail(estimate, clientName, clientMessage);
    const attachments = [];

    if (pdfFilePath) {
      attachments.push({
        filename: path.basename(pdfFilePath), // Extract the file name from the path
        path: pdfFilePath, // The path to the saved PDF file
      });
      console.log('PDF file found and will be sent with the email.');
    } else {
      console.warn('No PDF file path found to send with the email.');
    }

    const accountEmail = estimate.account.account_email || process.env.DefaultEmail;
    await sendEmail(email, `Estimate ${estimate.estimate_number}`, htmlContent, attachments, accountEmail);
    const estimateObj=await Estimate.findOne({_id:id,account:req.user.account_id})
    estimateObj.sent = true;
    estimateObj.status = 'Sent';
    await estimateObj.save();

    res.status(200).json({ message: 'Estimate sent successfully', data: estimate });
  } catch (error) {
    console.error('Error sending estimate:', error);
    res.status(500).json({ message: 'Error sending estimate', error: error.message });
  }
};
export const searchEstimateByItemId = async (req, res) => {
  const { id } = req.params;
  try {
    const estimates = await Estimate.find({
      'items.item': id,
      account: req.user.account_id,
    })
      .populate('account')
      .populate('client.client_id')
      .populate('client.billing_address')
      .populate('client.shipping_address')
      .populate('currency')
      .populate('items.item')
      .populate('taxes.tax_id')
      .exec();

    if (estimates.length === 0) {
      return res.status(200).json({ message: 'No estimates found for the given item ID', data: [] });
    }

    res.status(200).json({ message: 'Estimates retrieved successfully', data: estimates });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving estimates', error });
  }
};
