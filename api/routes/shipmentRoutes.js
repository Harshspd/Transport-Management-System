import express from 'express';
import { createShipment, getAllShipments } from '../controllers/shipmentController.js';
//import { authCheck } from '../middlewares/authCheck.js';

const router = express.Router();
router.post('/',  createShipment);
router.get('/',  getAllShipments);

//router.post('/', authCheck, createShipment);
//router.get('/', authCheck, getAllShipments);

export default router;
