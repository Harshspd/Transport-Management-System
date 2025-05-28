import express from 'express';

import { authCheck } from '../middlewares/authCheck.js';
import {fetchIndustryOptions} from '../controllers/industryController.js';
const router = express.Router();
router.use(authCheck)

router.get('/', fetchIndustryOptions);


export default router;
