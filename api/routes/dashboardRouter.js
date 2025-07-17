import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authCheck } from '../middlewares/authCheck.js';

const router = express.Router();

router.get('/', authCheck, getDashboardStats);

export default router;
