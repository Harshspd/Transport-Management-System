import express from 'express';
import { createDriver, getAllDrivers } from '../controllers/driverController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/licenses/' });

router.post('/drivers', upload.single('licenseFile'), createDriver);
router.get('/drivers', getAllDrivers);

export default router;
