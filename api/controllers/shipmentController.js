import mongoose from 'mongoose';
import Shipment from '../models/Shipment.js';
import { serverError } from '../helpers/responseUtility.mjs';

export const createShipment = async (req, res) => {
  try {
    const { consigner, consignee, driver, vehicle, ...rest } = req.body;

    // Check if required fields are present
    if (!consigner || !consignee || !driver || !vehicle) {
      return res.status(400).json({
        message: 'Missing required fields',
        error: true,
      });
    }

    // Validate and convert string IDs to ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(consigner) ||
      !mongoose.Types.ObjectId.isValid(consignee) ||
      !mongoose.Types.ObjectId.isValid(driver) ||
      !mongoose.Types.ObjectId.isValid(vehicle)
    ) {
      return res.status(400).json({
        message: 'One or more IDs are invalid ObjectId values',
        error: true,
      });
    }

    // Create the shipment
    const shipment = await Shipment.create({
      consigner: new mongoose.Types.ObjectId(consigner),
      consignee: new mongoose.Types.ObjectId(consignee),
      driver: new mongoose.Types.ObjectId(driver),
      vehicle: new mongoose.Types.ObjectId(vehicle),
      ...rest,
    });

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
