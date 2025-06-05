import express from 'express';
import { createDriver, getAllDrivers } from '../controllers/driverController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/licenses/' });

router.post('/', upload.single('licenseFile'), createDriver);
router.get('/', getAllDrivers);

export default router;
