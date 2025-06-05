import express from 'express';
import { createShipment, getAllShipments } from '../controllers/shipmentController.js';

const router = express.Router();

router.post('/', createShipment);
router.get('/', getAllShipments);

export default router;
