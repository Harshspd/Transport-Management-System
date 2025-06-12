import Vehicle from '../models/Vehicle.js';
import { serverError } from '../helpers/responseUtility.mjs';

export const createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle({
      ...req.body,
      rc_file: req.file?.path || '',
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

export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json({
      message: 'Vehicles fetched successfully',
      data: vehicles,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// update
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete

export const deleteVehicle = async (req, res) => {
  try {
    const result = await Vehicle.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};