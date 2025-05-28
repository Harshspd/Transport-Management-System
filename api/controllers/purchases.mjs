import { sendErrorResponse } from '../helpers/responseUtility.mjs';
import Purchase from '../models/Purchase.mjs';
import PurchaseService from '../services/PurchaseService.mjs';
import UtilityService from '../services/UtilityService.mjs';
import ItemService from '../services/ItemService.mjs';

export const isVendorInvoiceExist = async (req, res) => {
  const { vendorId, invoiceNumber } = req.params;
  const accountId = req.user.account_id;

  try {
    const purchase = await PurchaseService.vendorInvoiceExists(invoiceNumber, vendorId, accountId);
    return res.status(200).json({ id: purchase?._id ?? null, message: `Purchase ${!purchase ? ' not ' : ''}found` });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const createPurchase = async (req, res) => {
  try {
    const purchaseData = req.body;
    // Usage to create a new purchase
    const purchaseExits = await PurchaseService.vendorInvoiceExists(purchaseData.vendorInvoiceNumber, purchaseData.vendor, req.user.account_id);
    if (purchaseExits) {
      return sendErrorResponse(res, 'Error Creating Purchase', `Cannot Create Purchase. Purchase with ${purchaseData.vendorInvoiceNumber} aleardy exists`, 409);
    }
    const purchase = await PurchaseService.createPurchase(purchaseData, req.user.account_id,req.user._id);
    res.status(201).json(purchase);
  } catch (error) {
    
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getAllPurchases = async (req, res) => {
  try {
    // Retrieve all purchases and populate the vendor field
    const account = req.user.account_id;
    const purchases = await Purchase.find({ account })
      .populate('vendor', 'name') // Adjust this based on the fields in your Vendor schema
      .select('receiptNumber vendor vendorInvoiceNumber vendorInvoiceDate status createdAt purchaseDate')
      .lean();
    // If no purchases are found, return an empty array
    if (!purchases.length) {
      return res.status(200).json([]);
    }

    const purchaseList = purchases.map((purchase) => ({
      ...purchase,
      id: purchase._id,
    }));

    res.status(200).json(purchaseList);
  } catch (error) {
    return sendErrorResponse(res, 'Server Error', 'Something Went Wrong', 500);
  }
};

export const getPurchaseById = async (req, res) => {
  const { id } = req.params;

  try {
    const purchase = await Purchase.findOne({ _id: id, account: req.user.account_id })
    .populate('vendor')
    .populate({
      path: 'items.itemId',
      populate: {
        path: 'taxes', // Populate the taxes array within each itemId
      },
    })
    .lean();

    if (!purchase) {
      return sendErrorResponse(res, 'Not Found', 'Purchase Not found', 404);
    }
    // Return the populated and filtered purchase data
    res.status(200).json(purchase);
  } catch (error) {

    // Handle any errors during the database operation
    return sendErrorResponse(res, 'Server Error', error.message, 500);
  }
};
