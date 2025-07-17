import express from 'express';
import {
  getAllNegotiatedRates,
  addNegotiatedRate,
  updateNegotiatedRate,getNegotiatedRateById
} from '../controllers/rateController.js';
import { authCheck } from '../middlewares/authCheck.js';

const router = express.Router();

router.get('/', authCheck, getAllNegotiatedRates);
router.get('/:id', authCheck, getNegotiatedRateById);
router.post('/', authCheck, addNegotiatedRate);
router.put('/:id', authCheck, updateNegotiatedRate);

export default router;
