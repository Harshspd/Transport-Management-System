import express from 'express';
import { createConsigner, getAllConsigners } from '../controllers/consignerController.js';

const router = express.Router();


router.post('/', createConsigner);         
router.get('/', getAllConsigners);


export default router;
