import express from 'express';
import { createOrUpdateAccount , fetchAccounts,getAccountById, getAssociatedAccount} from '../controllers/setting.mjs';
import { upload,handleFileUpload } from '../controllers/uploadFiles.mjs';
import { authCheck } from '../middlewares/authCheck.js';
const router = express.Router();
router.use(authCheck)
router.post('/account', createOrUpdateAccount);
router.put('/account/:id', createOrUpdateAccount);
router.get('/account',fetchAccounts);
router.get('/accountId',getAccountById);
router.get('/account/associated',getAssociatedAccount );




// Define API endpoint for file upload
router.post('/upload', upload.single('file'), handleFileUpload);

export default router;