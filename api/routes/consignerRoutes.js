import express from 'express';
import {
  createConsigner,
  getAllConsigners,
  updateConsigner,
  deleteConsigner,
} from '../controllers/consignerController.js';

const router = express.Router();

router.post('/', createConsigner);
router.get('/', getAllConsigners);

router.put('/:id', updateConsigner);   // Update
router.delete('/:id', deleteConsigner); //  Delete

export default router;
