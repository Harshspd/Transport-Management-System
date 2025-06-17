import express from 'express';
import { createVehicle, getAllVehicles, updateVehicle, deleteVehicle } from '../controllers/vehicleController.js';
import { upload } from '../controllers/uploadFiles.mjs'; 

const router = express.Router();

router.post('/', upload.single('rc_file'), createVehicle);
router.get('/', getAllVehicles);
router.put('/:id', upload.single('rc_file'), updateVehicle); // optional: allow updating RC file
router.delete('/:id', deleteVehicle);

export default router;
