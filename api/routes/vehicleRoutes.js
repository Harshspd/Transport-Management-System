import express from 'express';
import { createVehicle, getAllVehicles } from '../controllers/vehicleController.js';
import { upload } from '../controllers/uploadFiles.mjs'; 

const router = express.Router();

// Use custom multer config that handles filename + path
router.post('/', upload.single('rcFile'), createVehicle);
router.get('/', getAllVehicles);

export default router;
