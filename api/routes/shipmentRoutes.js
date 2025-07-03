import express from 'express';
import { createShipment, getAllShipments, updateShipment, deleteShipment,updateShipmentStatus,getShipmentById } from '../controllers/shipmentController.js';
import { authCheck } from '../middlewares/authCheck.js';

const router = express.Router();
router.post('/', authCheck, createShipment);
router.get('/', authCheck, getAllShipments);
router.get('/:id',authCheck, getShipmentById);
router.put('/:id', authCheck, updateShipment);
router.delete('/:id', authCheck, deleteShipment);
router.patch('/:id/status',authCheck, updateShipmentStatus);

/*router.post('/',  createShipment);
router.get('/',  getAllShipments);
router.put('/:id', updateShipment);
router.delete('/:id',  deleteShipment);
router.patch('/:id/status', updateShipmentStatus);*/

export default router;
