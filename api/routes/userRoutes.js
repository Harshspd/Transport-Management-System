import express from 'express';
import { authCheck } from '../middlewares/authCheck.js';
import { getUserById } from '../controllers/userController.js';

const router = express.Router();
router.use(authCheck);
router.get('/',getUserById)
export default router;
