import express from 'express';
import { createVehicle, getAllVehicles } from '../controllers/vehicleController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/rcs/' });

router.post('/', upload.single('rcFile'), createVehicle);
router.get('/', getAllVehicles);

export default router;
