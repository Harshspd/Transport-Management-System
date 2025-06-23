import mongoose from 'mongoose';
import Shipment from '../models/Shipment.js';
import { serverError } from '../helpers/responseUtility.mjs';
 import {
  validateRequiredFields,
  validateObjectIdFields,checkDuplicate} from '../helpers/validationUtility.mjs';



// Create Shipment
export const createShipment = async (req, res) => {
  try {
    const { consigner, consignee, driver, vehicle, ...rest } = req.body;

    // ✅ Step 1: Required Fields Check
    const requiredFields = ['consigner', 'consignee', 'delivery_location'];
    const missingFields = validateRequiredFields(requiredFields, req.body);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required field${missingFields.length > 1 ? 's' : ''}: ${missingFields.join(', ')}`,
        error: true,
      });
    }

    // ✅ Step 2: ObjectId Validations
    const idFields = ['consigner', 'consignee', 'driver', 'vehicle'];
    const invalidFields = validateObjectIdFields(idFields, req.body);

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Invalid ObjectId for field${invalidFields.length > 1 ? 's' : ''}: ${invalidFields.join(', ')}`,
        error: true,
      });
    }

    // ✅ Step 3: Create Shipment
    const shipment = await Shipment.create({
      consigner: new mongoose.Types.ObjectId(consigner),
      consignee: new mongoose.Types.ObjectId(consignee),
      driver: driver ? new mongoose.Types.ObjectId(driver) : undefined,
      vehicle: vehicle ? new mongoose.Types.ObjectId(vehicle) : undefined,
      ...rest,
      created_by: req.user._id,
      organization_id: req.user.account_id,
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

// Get all Shipments under user's organization
export const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find({ organization_id: req.user.account_id })
      .populate('consigner')
      .populate('consignee')
      .populate('driver')
      .populate('vehicle')
      .populate('created_by', 'email');

    res.status(200).json({
      message: 'Shipments fetched successfully',
      data: shipments,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Update Shipment (and track updated_by)
export const updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findOneAndUpdate(
      {
        _id: req.params.id,
        organization_id: req.user.account_id,
      },
      {
        ...req.body,
        updated_by: req.user._id,
      },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json({
      message: 'Shipment updated successfully',
      data: shipment,
    });
  } catch (err) {
    serverError(res, err);
  }
};

// Delete Shipment
export const deleteShipment = async (req, res) => {
  try {
    const result = await Shipment.findOneAndDelete({
      _id: req.params.id,
      organization_id: req.user.account_id,
    });

    if (!result) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json({ message: 'Shipment deleted successfully' });
  } catch (err) {
    serverError(res, err);
  }
};

// Update Shipment Status
export const updateShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Open', 'In-Transit', 'Delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedShipment = await Shipment.findOneAndUpdate(
      {
        _id: id,
        organization_id: req.user.account_id,
      },
      {
        status,
        updated_by: req.user._id,
      },
      { new: true }
    );

    if (!updatedShipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json({ message: 'Shipment status updated', shipment: updatedShipment });
  } catch (err) {
    serverError(res, err);
  }
};
