import express from 'express';
import { createVehicle, getAllVehicles, updateVehicle, deleteVehicle } from '../controllers/vehicleController.js';
import { upload } from '../controllers/uploadFiles.mjs'; 
import { authCheck } from '../middlewares/authCheck.js';

const router = express.Router();

router.post('/',authCheck, upload.single('rc_file'), createVehicle);
router.get('/',authCheck, getAllVehicles);
router.put('/:id',authCheck, upload.single('rc_file'), updateVehicle); // optional: allow updating RC file
router.delete('/:id',authCheck, deleteVehicle);

export default router;
