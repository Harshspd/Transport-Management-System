import fs from 'fs';
import path from 'path';
import Account from '../models/Account.mjs';
import Invoice from '../models/Invoice.mjs';
import Estimate from '../models/Estimate.mjs';

const createUploadDir = () => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

export default createUploadDir;

export const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', options);
};

// Takes invoice number as parameter and retruns serial-number and prefix
export const ExtractPrefixAndSerialNo = (invoiceNumber) => {
  const match = invoiceNumber.match(/\d+$/);
  if (match) {
    const lastDigits = match[0];
    const startIndex = invoiceNumber.lastIndexOf(lastDigits);
    return { prefix: invoiceNumber.slice(0, startIndex), serialNo: lastDigits };
  }
  throw new Error('Invalid Invoice Number Format');
};



export const generateEstimateNumber = async (account_id) => {
  try {
    // Fetch account details to get the current prefix
    const account = await Account.findById(account_id);
    const prefix = account?.estimateSettings?.prefix || 'EST';

    // Find the latest invoice for the account and get the highest serial number
    const estimate = await Estimate.findOne({ account: account_id })
      .sort({ serial_no: -1 })
      .exec();

    // Determine the next serial number
    const newSerialNo = (estimate && estimate.serial_no) ? estimate.serial_no + 1 : 1;
    // Pad the serial number to 4 digits
    const paddedNumber = newSerialNo.toString().padStart(4, '0');
    // Return the full invoice number and the serial number
    return { estimateNumber: `${prefix}${paddedNumber}`, newSerialNo };
  } catch (error) {
    console.error('Error generating Estimate number:', error);
    throw new Error('Error generating Estimate number');
  }
};

export const sanitizeFileName = (name) => name.replace(/[\/\\:*?"<>|#]/g, '_').trim()

export const generateGRN=()=> {
  // Generate a random 6-digit number
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  // Format it as a string with "GRN" prefix
  const grn = `GRN${randomNumber}`;
  return grn;
}