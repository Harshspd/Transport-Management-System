import express from 'express';
import {
  createConsignee,
  getAllConsignees,
  updateConsignee,
  deleteConsignee,
  getConsigneeById
} from '../controllers/consigneeController.js';
import { authCheck } from '../middlewares/authCheck.js';


const router = express.Router();

router.post('/',authCheck, createConsignee);
router.get('/',authCheck, getAllConsignees);
router.get('/:id',authCheck, getConsigneeById);

router.put('/:id',authCheck, updateConsignee);     // Update
router.delete('/:id',authCheck, deleteConsignee);  // Delete

export default router;
