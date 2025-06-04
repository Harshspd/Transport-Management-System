import Driver from '../models/Driver.js';
import { serverError } from '../helpers/responseUtility.mjs';

export const createDriver = async (req, res) => {
  try {
    const driver = new Driver({
      ...req.body,
      licenseFile: req.file?.path || '',
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

export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json({
      message: 'Drivers fetched successfully',
      data: drivers,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};