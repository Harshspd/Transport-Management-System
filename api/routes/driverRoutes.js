import express from 'express';
import { createDriver, getAllDrivers, updateDriver, deleteDriver } from '../controllers/driverController.js';
import { upload } from '../controllers/uploadFiles.mjs'; 

const router = express.Router();

router.post('/', upload.single('licenseFile'), createDriver);
router.get('/', getAllDrivers);
router.put('/:id', upload.single('licenseFile'), updateDriver); 
router.delete('/:id', deleteDriver);

export default router;
