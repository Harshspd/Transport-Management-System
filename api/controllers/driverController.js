import Driver from '../models/Driver.js';
import { serverError } from '../helpers/responseUtility.mjs';
import mongoose from 'mongoose';

// Utility for missing field validation
const validateRequiredFields = (body, fields) => {
  return fields.filter(field => !body[field]);
};

// Utility for duplicate check  license_number)
const isDuplicateDriver = async (body, organization_id) => {
  return await Driver.findOne({
    license_number: body.license_number,
  });
};

// Create Driver
export const createDriver = async (req, res) => {
  try {
    const requiredFields = ['name', 'license_number'];
    const missingFields = validateRequiredFields(req.body, requiredFields);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required field${missingFields.length > 1 ? 's' : ''}: ${missingFields.join(', ')}`,
        error: true,
      });
    }

    const duplicate = await isDuplicateDriver(req.body, req.user.account_id);
    if (duplicate) {
      return res.status(409).json({
        message: 'Driver with the same name and license number already exists.',
        error: true,
      });
    }

    const driver = new Driver({
      ...req.body,
      license_file: req.file?.path || '',
      created_by: req.user._id,
      organization_id: req.user.account_id,
    });

    await driver.save();
    res.status(201).json({
      message: 'Driver created successfully',
      data: driver,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Get All Drivers under Organization
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ organization_id: req.user.account_id });
    res.status(200).json({
      message: 'Drivers fetched successfully',
      data: drivers,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Update Driver with updated_by
export const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndUpdate(
      { _id: req.params.id, organization_id: req.user.account_id },
      { ...req.body, updated_by: req.user._id },
      { new: true }
    );
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json({
      message: 'Driver updated successfully',
      data: driver,
    });
  } catch (err) {
    serverError(res, err);
  }
};

// Delete Driver by ID & Org
export const deleteDriver = async (req, res) => {
  try {
    const result = await Driver.findOneAndDelete({
      _id: req.params.id,
      organization_id: req.user.account_id
    });
    if (!result) return res.status(404).json({ message: 'Driver not found' });
    res.json({ message: 'Driver deleted successfully' });
  } catch (err) {
    serverError(res, err);
  }
};
