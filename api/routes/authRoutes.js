import express from 'express';
const router = express.Router();
import { signin, signup, generateOTP, changePassword, unlockAccount, changeAccountEmail} from '../controllers/authController.js';
import { authCheck, otpCheck,accountLockCheck } from '../middlewares/authCheck.js';

router.post('/login',accountLockCheck,signin)
router.post('/signup',otpCheck,signup)
router.post('/register',signup)
router.post('/generate-otp',generateOTP)
router.put('/forgot-password',otpCheck,changePassword)
router.put('/unlock-account',otpCheck,unlockAccount)
router.patch('/change-account-email',authCheck,otpCheck,changeAccountEmail);
router.patch('/change-password',authCheck,changePassword);

export default router;