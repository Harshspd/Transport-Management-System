import express from 'express';
import { createShipment, getAllShipments } from '../controllers/shipmentController.js';

const router = express.Router();

router.post('/shipments', createShipment);
router.get('/shipments', getAllShipments);

export default router;
