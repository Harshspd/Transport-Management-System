import express from 'express';
import {
  getClients, createClient, updateClient, searchClient, archiveClient,
  exportClients, getArchivedClients, getClientById,fetchClients
} from '../controllers/clients.mjs';

import { authCheck } from '../middlewares/authCheck.js';
const router = express.Router();
router.use(authCheck)

router.post('/', createClient);
router.get('/', getClients);
router.get('/client', fetchClients);
router.patch('/:clientId', archiveClient);
router.put('/:clientId', updateClient);
router.get('/archived', getArchivedClients);
router.get('/export', exportClients);
router.get('/search', searchClient);
router.get('/:clientId', getClientById);

export default router;
