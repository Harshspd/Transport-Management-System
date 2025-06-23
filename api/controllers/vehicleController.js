import Vehicle from '../models/Vehicle.js';
import { serverError } from '../helpers/responseUtility.mjs';
import {validateRequiredFields , checkDuplicate } from '../helpers/validationUtility.mjs';

// CREATE Vehicle
export const createVehicle = async (req, res) => {
  try {
    const requiredFields = ['vehicle_number', 'vehicle_type', 'capacity_weight', 'rc_number'];
    const missing = checkMissingFields(req.body, requiredFields);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required field(s): ${missing.join(', ')}`, error: true });
    }

    // Duplicate check 
    const duplicate = await checkDuplicate(Vehicle, {
      $or: [
        { vehicle_number: req.body.vehicle_number },
        { rc_number: req.body.rc_number }
      ]
    });
    if (duplicate) {
      return res.status(409).json({ message: 'Vehicle with same vehicle number or RC already exists', error: true });
    }

    const vehicle = new Vehicle({
      ...req.body,
      rc_file: req.file?.path || '',
      created_by: req.user._id,
      organization_id: req.user.account_id,
    });

    await vehicle.save();
    res.status(201).json({
      message: 'Vehicle created successfully',
      data: vehicle,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// READ All Vehicles
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ organization_id: req.user.account_id });
    res.status(200).json({
      message: 'Vehicles fetched successfully',
      data: vehicles,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// UPDATE Vehicle
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, organization_id: req.user.account_id },
      { ...req.body, updated_by: req.user._id },
      { new: true }
    );
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle updated successfully', data: vehicle });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE Vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const result = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      organization_id: req.user.account_id
    });
    if (!result) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
