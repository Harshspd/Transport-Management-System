import express from 'express';
import { upsertRate, getAllRates } from '../controllers/rateController.js';
import { authCheck } from '../middlewares/authCheck.js';

const router = express.Router();

router.post('/', authCheck, upsertRate); 
router.put('/', authCheck, upsertRate);  
router.get('/', authCheck, getAllRates);

export default router;
