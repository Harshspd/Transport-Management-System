import express from 'express';
import { createDriver, getAllDrivers } from '../controllers/driverController.js';
import { upload } from '../controllers/uploadFiles.mjs'; 

const router = express.Router();

router.post('/', upload.single('licenseFile'), createDriver); 
router.get('/', getAllDrivers); 

export default router;
