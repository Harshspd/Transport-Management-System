import express from 'express';
import { createConsigner, getAllConsigners } from '../controllers/consignerController.js';

const router = express.Router();

router.post('/conigners', createConsigner);
router.get('/consigners', getAllConsigners);

export default router;
