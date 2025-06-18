import Driver from '../models/Driver.js';
import { serverError } from '../helpers/responseUtility.mjs';

export const createDriver = async (req, res) => {
  try {
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

// Update
export const updateDriver = async (req, res) => {
  try {
   const driver = await Driver.findOneAndUpdate(
  { _id: req.params.id, organization_id: req.user.account_id },
  { ...req.body, updated_by: req.user._id },
  { new: true }
);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const deleteDriver = async (req, res) => {
  try {
    const result = await Driver.findOneAndDelete({
   _id: req.params.id,
   organization_id: req.user.account_id
});
    if (!result) return res.status(404).json({ message: 'Driver not found' });
    res.json({ message: 'Driver deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};