import express from 'express';
import {
  createConsignee,
  getAllConsignees,
  updateConsignee,
  deleteConsignee
} from '../controllers/consigneeController.js';

const router = express.Router();

router.post('/', createConsignee);
router.get('/', getAllConsignees);


router.put('/:id', updateConsignee);     // Update
router.delete('/:id', deleteConsignee);  // Delete

export default router;
