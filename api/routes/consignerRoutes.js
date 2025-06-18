import express from 'express';
import {
  createConsigner,
  getAllConsigners,
  updateConsigner,
  deleteConsigner,
} from '../controllers/consignerController.js';
import { authCheck } from '../middlewares/authCheck.js';


const router = express.Router();

router.post('/',authCheck, createConsigner);
router.get('/',authCheck, getAllConsigners);

router.put('/:id',authCheck, updateConsigner);   // Update
router.delete('/:id',authCheck, deleteConsigner); //  Delete

export default router;
