import express from 'express';
import { createDriver, getAllDrivers, updateDriver, deleteDriver,getDriverById } from '../controllers/driverController.js';
import { upload } from '../controllers/uploadFiles.mjs'; 
import { authCheck } from '../middlewares/authCheck.js';


const router = express.Router();

router.post('/',authCheck, upload.single('licenseFile'), createDriver);
router.get('/',authCheck, getAllDrivers);
router.get('/:id',authCheck, getDriverById);
router.put('/:id',authCheck, upload.single('licenseFile'), updateDriver); 
router.delete('/:id',authCheck, deleteDriver);

export default router;
