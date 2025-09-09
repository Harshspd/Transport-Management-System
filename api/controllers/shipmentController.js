import mongoose from 'mongoose';
import Shipment from '../models/Shipment.js';
import { serverError } from '../helpers/responseUtility.mjs';
import {
  validateRequiredFields,
  validateObjectIdFields,
  checkDuplicate,
} from '../helpers/validationUtility.mjs';

import dotenv from 'dotenv';
dotenv.config();

// Create Shipment
export let createShipment = async (req, res) => {
  try {
    const { consigner, consignee, driver, vehicle, agent, transport_mode, ...rest } = req.body;

    // Step 1: Required Fields Check
    const requiredFields = ['consigner', 'consignee', 'delivery_location'];
    const missingFields = validateRequiredFields(requiredFields, req.body);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required field${missingFields.length > 1 ? 's' : ''}: ${missingFields.join(', ')}`,
        error: true,
      });
    }

    // Step 2: ObjectId Validations
    const idFields = ['consigner', 'consignee', 'driver', 'vehicle', 'transport_mode'];
    if (agent) idFields.push('agent');
    const invalidFields = validateObjectIdFields(idFields, req.body);

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Invalid ObjectId for field${invalidFields.length > 1 ? 's' : ''}: ${invalidFields.join(', ')}`,
        error: true,
      });
    }

    // ✅ Step 3: Auto-generate bility_no
    const latestShipment = await Shipment.findOne({
      organization_id: req.user.account_id,
    })
      .sort({ bility_no: -1 })
      .limit(1);

    const bility_no = latestShipment?.bility_no
      ? latestShipment.bility_no + 1
      : parseInt(process.env.ShipmentBaseId) || 4000;

    // Step 4: Check for duplicate Bility Number in same organization
    const duplicate = await Shipment.findOne({
      bility_no,
      organization_id: req.user.account_id,
    });

    if (duplicate) {
      return res.status(400).json({
        message: `Bility Number ${bility_no} already exists.`,
        error: true,
      });
    }

    // Step 5: Create Shipment
    const shipment = await Shipment.create({
      consigner: new mongoose.Types.ObjectId(consigner),
      consignee: new mongoose.Types.ObjectId(consignee),
      driver: driver ? new mongoose.Types.ObjectId(driver) : undefined,
      vehicle: vehicle ? new mongoose.Types.ObjectId(vehicle) : undefined,
      agent: agent ? new mongoose.Types.ObjectId(agent) : undefined,
      transport_mode: transport_mode ? new mongoose.Types.ObjectId(transport_mode) : undefined,

      bility_no, // ✅ always backend generated
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

// Get last Bility Number by organization
export const getLastBilityNumberByOrganization = async (req, res) => {
  try {
    const latestShipment = await Shipment.findOne({
      organization_id: req.user.account_id,
    })
      .sort({ bility_no: -1 })
      .limit(1);

    const nextBilityNo = latestShipment?.bility_no
      ? latestShipment.bility_no + 1
      : parseInt(process.env.ShipmentBaseId) || 4000;

    res.status(200).json({
      message: 'Next Bility Number fetched successfully',
      bility_no: nextBilityNo,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Get all Shipments
export const getAllShipments = async (req, res) => {
  try {
    const filter = { organization_id: req.user.account_id };

    // Add status filter if query param is present
    const allowedStatuses = ['Open', 'In-Transit', 'Delivered', 'Cancelled', 'Completed'];

    if (req.query.status) {
      if (!allowedStatuses.includes(req.query.status)) {
        return res.status(400).json({
          message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`,
          error: true,
        });
      }
      filter.status = req.query.status;
    }

    const shipments = await Shipment.find(filter)
      .populate('consigner')
      .populate('consignee')
      .populate('driver')
      .populate('vehicle')
      .populate('agent')
      .populate('transport_mode')
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

// Get One Shipment by ID
export const getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      _id: req.params.id,
      organization_id: req.user.account_id,
    })
      .populate('consigner')
      .populate('consignee')
      .populate('driver')
      .populate('vehicle')
      .populate('agent')
      .populate('transport_mode')
      .populate('created_by', 'email');

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found', error: true });
    }

    res.status(200).json({
      message: 'Shipment fetched successfully',
      data: shipment,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Update Shipment
export const updateShipment = async (req, res) => {
  try {
    const objectIdFields = ['consigner', 'consignee', 'driver', 'vehicle', 'agent', 'transport_mode'];

    for (const field of objectIdFields) {
      const value = req.body[field];

      if (value === '' || value === null || value === undefined) {
        delete req.body[field];
      } else if (mongoose.Types.ObjectId.isValid(value)) {
        req.body[field] = new mongoose.Types.ObjectId(value);
      } else {
        return res.status(400).json({
          message: `Invalid ObjectId for field: ${field}`,
          error: true,
        });
      }
    }

    // Perform the update
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

    const allowedStatuses = ['Open', 'In-Transit', 'Delivered', 'Cancelled', 'Completed'];
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
