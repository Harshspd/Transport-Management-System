import Driver from '../models/Driver.js';
import { serverError } from '../helpers/responseUtility.mjs';
import { validateRequiredFields, checkDuplicate } from '../helpers/validationUtility.mjs';

// Define base URL for returning full file URL
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// Helper to convert local file path to full URL
const formatLicenseFileUrl = (driver) => {
  if (driver?.license_file) {
    driver.license_file = `${BASE_URL}/${driver.license_file.replace(/\\/g, '/')}`;
  }
  return driver;
};

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

    // 2. Optional duplicate check on license_number scoped to organization
    if (req.body.license_number) {
      const duplicate = await checkDuplicate(Driver, {
        license_number: req.body.license_number,
        organization_id: req.user.account_id,
      });

      if (duplicate) {
        return res.status(409).json({
          message: 'Driver with this license number already exists in your organization',
          error: true,
        });
      }
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
      data: formatLicenseFileUrl(driver.toObject()),
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
    const formattedDrivers = drivers.map(driver => formatLicenseFileUrl(driver.toObject()));
    res.status(200).json({
      message: 'Drivers fetched successfully',
      data: formattedDrivers,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Get One Driver by ID
export const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findOne({
      _id: req.params.id,
      organization_id: req.user.account_id,
    });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found', error: true });
    }

    res.status(200).json({
      message: 'Driver fetched successfully',
      data: formatLicenseFileUrl(driver.toObject()),
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

//  Update Driver
export const updateDriver = async (req, res) => {
  try {
    const updateData = { ...req.body, updated_by: req.user._id };
    if (req.file) {
      updateData.license_file = req.file.path;
    }

    const driver = await Driver.findOneAndUpdate(
      { _id: req.params.id, organization_id: req.user.account_id },
      updateData,
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({
      message: 'Driver updated successfully',
      data: formatLicenseFileUrl(driver.toObject()),
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
