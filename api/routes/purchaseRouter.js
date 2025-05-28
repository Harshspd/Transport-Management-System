import express from 'express';
import { isVendorInvoiceExist, createPurchase, getAllPurchases, getPurchaseById } from '../controllers/purchases.mjs';
import { authCheck } from '../middlewares/authCheck.js';

const router = express.Router();
router.use(authCheck);
router.get('/vendor-invoice-exist/:vendorId/:invoiceNumber',isVendorInvoiceExist)
router.post('/', createPurchase);
router.get('/', getAllPurchases);
router.get('/:id', getPurchaseById);
export default router;
