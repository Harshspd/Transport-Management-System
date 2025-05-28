import express from 'express';
import { createAutomatedInvoice,createInvoice, updateInvoice, getInvoices,deleteInvoice,  toggleArchiveInvoice, getInvoiceNumber,searchInvoicesByClientName, getArchivedInvoices, exportInvoicesToCSV,getInvoiceById,sendInvoiceAndMarkSent, refundInvoice,searchInvoiceByItemId, getInvoicePdf, addPaymentToInvoice, deletePaymentFromInvoice, createInvoiceFromPurchase} from '../controllers/invoices.mjs';
import { authCheck } from '../middlewares/authCheck.js';

const router = express.Router();




router.use(authCheck)
router.post('/automated', createAutomatedInvoice);

router.post('/', createInvoice);
router.get('/invoice-number',getInvoiceNumber);
router.get('/archived', getArchivedInvoices);
router.get('/search',searchInvoicesByClientName);
router.post('/export',exportInvoicesToCSV);
router.put('/update/:id',updateInvoice );
router.get('/:id', getInvoiceById);
router.delete('/delete/:id', deleteInvoice);
router.patch('/toggle-archive/:id',toggleArchiveInvoice);
router.get('/', getInvoices);
router.get('/generate-pdf/:id', getInvoicePdf);
router.post('/send-invoice/:id', sendInvoiceAndMarkSent);
router.patch('/refund/:id',refundInvoice);
router.get('/search-by-item/:id',searchInvoiceByItemId);
router.put('/payment',addPaymentToInvoice);
router.delete('/payment',deletePaymentFromInvoice)
router.post('/:purchaseId',createInvoiceFromPurchase)
export default router;

