import Driver from '../models/Driver.js';
import { serverError } from '../helpers/responseUtility.mjs';
import { validateRequiredFields, checkDuplicate } from '../helpers/validationUtility.mjs';

//  Create Driver
export const createDriver = async (req, res) => {
  try {
    // 1. Required fields validation
    const requiredFields = ['name', 'contact.phone'];
    const missingFields = validateRequiredFields(requiredFields, req.body);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required field${missingFields.length > 1 ? 's' : ''}: ${missingFields.join(', ')}`,
        error: true,
      });
    }

    // 2. Duplicate license_number check (across all orgs)
    const duplicate = await checkDuplicate(Driver, { license_number: req.body.license_number });
    if (duplicate) {
      return res.status(409).json({
        message: 'Driver with this license number already exists',
        error: true,
      });
    }

    // 3. Create driver
    const driver = await Driver.create({
      ...req.body,
      license_file: req.file?.path || '',
      created_by: req.user._id,
      organization_id: req.user.account_id,
    });

    res.status(201).json({
      message: 'Driver created successfully',
      data: driver,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

//  Get All Drivers
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

//  Update Driver
export const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndUpdate(
      { _id: req.params.id, organization_id: req.user.account_id },
      { ...req.body, updated_by: req.user._id },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({
      message: 'Driver updated successfully',
      data: driver,
    });
  } catch (error) {
    serverError(res, error);
  }
};

//  Delete Driver
export const deleteDriver = async (req, res) => {
  try {
    const deleted = await Driver.findOneAndDelete({
      _id: req.params.id,
      organization_id: req.user.account_id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    serverError(res, error);
  }
};
