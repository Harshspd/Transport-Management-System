import express from 'express';
import { generateStockReport, getBatchWiseInfoForItem, getItemHistory } from '../controllers/inventory.mjs';
import { authCheck } from '../middlewares/authCheck.js';

const router = express.Router();
router.use(authCheck);
router.get('/generate-report', generateStockReport);

router.get('/:itemId', getBatchWiseInfoForItem);
router.get('/history/:itemId',getItemHistory)
export default router;
