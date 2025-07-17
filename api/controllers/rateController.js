import mongoose from 'mongoose';
import Shipment from '../models/Shipment.js';
import { serverError } from '../helpers/responseUtility.mjs';
import { validateRequiredFields, validateObjectIdFields } from '../helpers/validationUtility.mjs';

// Get all negotiated rates
export const getAllNegotiatedRates = async (req, res) => {
  try {
    const shipments = await Shipment.find({
      organization_id: req.user.account_id,
    })
      .populate('vehicle', 'vehicle_number')
      .populate('driver', 'name')
      .select('bility_no bill_date expected_delivery_date_and_time negotiated_rate driver vehicle');

    res.status(200).json({
      message: 'Negotiated rates fetched successfully',
      data: shipments,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};


// Get negotiated rate by shipment ID
export const getNegotiatedRateById = async (req, res) => {
  try {
    const shipmentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(shipmentId)) {
      return res.status(400).json({ message: 'Invalid shipment ID', error: true });
    }

    const shipment = await Shipment.findOne({
      _id: shipmentId,
      organization_id: req.user.account_id,
    })
      .populate('vehicle', 'vehicle_number')
      .populate('driver', 'name')
      .select('bility_no bill_date expected_delivery_date_and_time negotiated_rate driver vehicle');

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found', error: true });
    }

    res.status(200).json({
      message: 'Negotiated rate fetched successfully',
      data: shipment,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};


// Add negotiated rate
export const addNegotiatedRate = async (req, res) => {
  try {
    const { shipmentId, negotiated_rate } = req.body;

    const requiredFields = ['shipmentId', 'negotiated_rate'];
    const missingFields = validateRequiredFields(requiredFields, req.body);
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required field(s): ${missingFields.join(', ')}`,
        error: true,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(shipmentId)) {
      return res.status(400).json({ message: 'Invalid shipmentId', error: true });
    }

    const shipment = await Shipment.findOneAndUpdate(
      { _id: shipmentId, organization_id: req.user.account_id },
      { negotiated_rate, updated_by: req.user._id },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found', error: true });
    }

    res.status(200).json({
      message: 'Negotiated rate added successfully',
      data: shipment,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Update negotiated rate
export const updateNegotiatedRate = async (req, res) => {
  try {
    const shipmentId = req.params.id;
    const { negotiated_rate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(shipmentId)) {
      return res.status(400).json({ message: 'Invalid shipment ID', error: true });
    }

    const shipment = await Shipment.findOneAndUpdate(
      { _id: shipmentId, organization_id: req.user.account_id },
      { negotiated_rate, updated_by: req.user._id },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found', error: true });
    }

    res.status(200).json({
      message: 'Negotiated rate updated successfully',
      data: shipment,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};
