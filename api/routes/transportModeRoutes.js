import express from 'express';
import {
  createTransportMode,
  getAllTransportModes,
  getTransportModeById,
  updateTransportMode,
  deleteTransportMode
} from '../controllers/transportModeController.js';
import { authCheck } from '../middlewares/authCheck.js';

const router = express.Router();

// Create new transport mode
router.post('/', authCheck, createTransportMode);

// Get all transport modes
router.get('/', authCheck, getAllTransportModes);

// Get single transport mode by ID
router.get('/:id', authCheck, getTransportModeById);

// Update transport mode
router.put('/:id', authCheck, updateTransportMode);

// Delete transport mode
router.delete('/:id', authCheck, deleteTransportMode);

export default router;