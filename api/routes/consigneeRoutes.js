import express from 'express';
import { createConsignee, getAllConsignees } from '../controllers/consigneeController.js';

const router = express.Router();

router.post('/consignees', createConsignee);
router.get('/consignees', getAllConsignees);

export default router;
