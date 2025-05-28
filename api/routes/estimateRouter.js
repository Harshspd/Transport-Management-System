import express from 'express';
import { createEstimate,searchEstimateByClientName,getEstimateById,approveEstimate,getEstimates,updateEstimate, deleteEstimate,getArchivedEstimates, toggleArchiveEstimate,getEstimateNumber,exportEstimatesToCSV,invoiceEstimate,sendEstimateAndMarkSent,getEstimatePdf, searchEstimateByItemId} from '../controllers/estimates.mjs';


import { authCheck } from '../middlewares/authCheck.js';
const router = express.Router();



router.use(authCheck)


router.post('/', createEstimate);
router.get('/archived', getArchivedEstimates);
router.get('/search', searchEstimateByClientName);
router.get('/generate-pdf/:id', getEstimatePdf);
router.patch('/approve/:id', approveEstimate);
router.put('/update/:id', updateEstimate);
router.delete('/delete/:id', deleteEstimate);
router.post('/export',exportEstimatesToCSV);
router.get('/estimateNumber',getEstimateNumber);
router.get('/', getEstimates);
router.get('/:id', getEstimateById);
router.patch('/toggle-archive/:id',toggleArchiveEstimate);
router.post('/send-estimate/:id', sendEstimateAndMarkSent);
router.patch('/invoice/:id',invoiceEstimate);
router.get('/search-by-item/:id', searchEstimateByItemId);

export default router;
