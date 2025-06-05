import express from 'express';
import { createConsignee, getAllConsignees } from '../controllers/consigneeController.js';

const router = express.Router();

router.post('/', createConsignee);
router.get('/', getAllConsignees);

export default router;
