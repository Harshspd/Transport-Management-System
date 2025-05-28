import express from 'express';
import { getAllCountries, getCountryById, getCountry } from '../controllers/common.mjs';
import { handleFileUpload , upload } from '../controllers/uploadFiles.mjs';
import { authCheck } from '../middlewares/authCheck.js';
const router = express.Router();
router.use(authCheck)
router.get('/', getAllCountries);
router.get('/:id', getCountry, getCountryById);

router.post('/upload', upload.single('file'), handleFileUpload);

export default router;
