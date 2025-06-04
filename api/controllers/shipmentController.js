import Shipment from '../models/Shipment.js';
import { serverError } from '../helpers/responseUtility.mjs';

export const createShipment = async (req, res) => {
  try {
    const { consigner, consignee, driver, vehicle } = req.body;
    if (!consigner || !consignee || !driver || !vehicle) {
      return res.status(400).json({
        message: 'Missing required fields',
        error: true,
      });
    }
    const shipment = await Shipment.create(req.body);
    res.status(201).json({
      message: 'Shipment created successfully',
      data: shipment,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

export const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find()
      .populate('consigner')
      .populate('consignee')
      .populate('driver')
      .populate('vehicle');
    res.status(200).json({
      message: 'Shipments fetched successfully',
      data: shipments,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};
