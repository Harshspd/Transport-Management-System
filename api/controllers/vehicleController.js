import Vehicle from '../models/Vehicle.js';
import { serverError } from '../helpers/responseUtility.mjs';

export const createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle({
      ...req.body,
      rcFile: req.file?.path || '',
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