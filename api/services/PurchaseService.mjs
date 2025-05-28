import Inventory from '../models/Inventory.mjs';
import Purchase from '../models/Purchase.mjs';
import InventoryService from './InventoryService.mjs';

// services/PurchaseService.js
class PurchaseService {
  async vendorInvoiceExists(invoiceNumber, vendorId, accountId) {
    return await Purchase.findOne(
      { vendorInvoiceNumber: invoiceNumber, vendor: vendorId, account: accountId },
    );
  }

  async generateReceiptNo(account) {
    const prefix = 'GRN-';
    const purchase = await Purchase.findOne({ account }).sort({ serialNumber: -1 });
    const newSerialNo = (purchase && purchase.serialNumber) ? purchase.serialNumber + 1 : 1;
    const paddedNumber = newSerialNo.toString().padStart(4, '0');
    return { receiptNo: `${prefix}${paddedNumber}`, serialNo: newSerialNo };
  }

  // TODO : Replace createdby updateby changed by with logged in userid
  async createPurchase(purchaseData, account, user) {
    try {
      // Create a new purchase record
      const { receiptNo, serialNo } = await this.generateReceiptNo(account);

      // Set initial status and prepare status log entry
      const initialStatus = 'ordered'; // Initial status for the purchase
      const statusChangeLogEntry = {
        status: initialStatus,
        changedBy: user, // User creating the purchase
        changedAt: new Date(), // Timestamp of the change
      };
      // Create a new purchase record, adding the status change log
      const purchase = await Purchase.create({
        ...purchaseData,
        statusChangeLog: [statusChangeLogEntry], // Add initial status log entry
        receiptNumber: receiptNo,
        serialNumber: serialNo,
        status: initialStatus,
        account, // ObjectId referencing the account
        salesInvoice: null, // Reference to a sales invoice if generated
        createdBy: user, // ID of the user creating the purchase
        updatedBy: user, // ID of the user updating the purchases
        salesInvoice:[]
      });
      // Update stock for each item in the purchase
      for (const item of purchaseData.items) {
        if (item.itemId) {
          await InventoryService.addStock(item.itemId, item.quantity, {
            batchNo: item.batchNo,
            expDate: item.expDate,
            costPrice: item.costPrice,
            salePrice: item.salePrice,
            purchaseDate: purchaseData.vendorInvoiceDate,
            mrp: item.mrp,
            mfgDate: item.mfgDate,
          }, purchase._id, account);
        } else {

        }
      }

      return purchase;
    } catch (error) {
      throw new Error(`Error creating purchase: ${error.message}`);
    }
  }

  async getPurchaseById(purchaseId, account) {
    try {
      const purchase = await Purchase.findOne({ _id: purchaseId, account })
        .populate({
          path: 'items.itemId',
          populate: {
            path: 'taxes', // Populate the taxes field
            model: 'Tax', // Replace with the actual model name for the taxes
          },
        })
        .lean();

      if (!purchase) {
        throw new Error('Purchase Not Found');
      }

      // Return the populated and filtered purchase data
      return purchase;
    } catch (error) {
      console.log(error);
      throw error; // Just throw the error
    }
  }

  async updatePurchaseStatusInvoiced(purchaseId, salesInvoiceIds, account) {
    await Purchase.findOneAndUpdate(
      { _id: purchaseId, account },
      { 
        status: 'invoiced', 
        $push: { salesInvoice: { $each: salesInvoiceIds } } 
      },
      { new: true } 
    );
  }
}

export default new PurchaseService();
