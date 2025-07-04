import express from 'express';
import {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
} from '../controllers/agentController.js';
import { authCheck } from '../middlewares/authCheck.js';

const router = express.Router();

router.post('/', authCheck, createAgent);
router.get('/', authCheck, getAllAgents);
router.get('/:id', authCheck, getAgentById);
router.put('/:id', authCheck, updateAgent);
router.delete('/:id', authCheck, deleteAgent);

export default router;
