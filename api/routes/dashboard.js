import express from 'express';
import { authCheck } from '../middlewares/authCheck.js';
import {
  getTopClientsByTotalInvoicedAmount, fetchSystemSummary, getlatestInvoices, getRevenueSummaryForThePeriod,getInvoiceStatistics,getEstimatedRevenue
} from '../controllers/dashboard.mjs';
// import { getRequiredAccount } from "../controllers/dashboard.mjs";

const router = express.Router();
router.use(authCheck);

router.get('/invoices', getlatestInvoices);
router.get('/summary', fetchSystemSummary);
router.get('/monthly-invoice-summary', getRevenueSummaryForThePeriod);
router.get('/client-insights', getTopClientsByTotalInvoicedAmount);
router.get('/invoice-stats', getInvoiceStatistics);
router.get('/estimated-revenue', getEstimatedRevenue);
// router.get("/account", getRequiredAccount);

// router.get('/:id', getCountry, getCountryById);

// router.post('/upload', upload.single('file'), handleFileUpload);

export default router;
