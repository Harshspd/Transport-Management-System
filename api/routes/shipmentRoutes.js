import express from 'express';
import { createShipment, getAllShipments, updateShipment, deleteShipment,updateShipmentStatus, } from '../controllers/shipmentController.js';
//import { authCheck } from '../middlewares/authCheck.js';

const router = express.Router();
/*router.post('/', authCheck, createShipment);
router.get('/', authCheck, getAllShipments);
router.put('/:id', authCheck, updateShipment);
router.delete('/:id', authCheck, deleteShipment);*/

router.post('/',  createShipment);
router.get('/',  getAllShipments);
router.put('/:id', updateShipment);
router.delete('/:id',  deleteShipment);
router.patch('/:id/status', updateShipmentStatus);

export default router;
