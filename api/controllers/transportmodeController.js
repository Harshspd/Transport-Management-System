import TransportMode from '../models/TransportMode.js';
import { serverError } from '../helpers/responseUtility.mjs';
import { validateRequiredFields } from '../helpers/validationUtility.mjs';

// Create
export const createTransportMode = async (req, res) => {
  try {
    const missingFields = validateRequiredFields(['name'], req.body);
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required field: ${missingFields.join(', ')}`,
        error: true,
      });
    }

    const transportMode = await TransportMode.create({
      ...req.body,
      created_by: req.user._id,
      organization_id: req.user.account_id,
    });

    res.status(201).json({
      message: 'Transport Mode created successfully',
      data: transportMode,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Get All
export const getAllTransportModes = async (req, res) => {
  try {
    const modes = await TransportMode.find({ organization_id: req.user.account_id });
    res.status(200).json({
      message: 'Transport Modes fetched successfully',
      data: modes,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Get One
export const getTransportModeById = async (req, res) => {
  try {
    const mode = await TransportMode.findOne({
      _id: req.params.id,
      organization_id: req.user.account_id,
    });

    if (!mode) {
      return res.status(404).json({ message: 'Transport Mode not found', error: true });
    }

    res.status(200).json({
      message: 'Transport Mode fetched successfully',
      data: mode,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Update
export const updateTransportMode = async (req, res) => {
  try {
    console.log('Update body:', req.body);

    const updated = await TransportMode.findOneAndUpdate(
      { _id: req.params.id, organization_id: req.user.account_id },
      { ...req.body, updated_by: req.user._id },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Transport Mode not found' });
    }

    res.json({
      message: 'Transport Mode updated successfully',
      data: updated,

    });
  } catch (err) {
    serverError(res, err);
  }
};

// Delete
export const deleteTransportMode = async (req, res) => {
  try {
    const result = await TransportMode.findOneAndDelete({
      _id: req.params.id,
      organization_id: req.user.account_id,
    });

    if (!result) {
      return res.status(404).json({ message: 'Transport Mode not found' });
    }

    res.json({ message: 'Transport Mode deleted successfully' });
  } catch (err) {
    serverError(res, err);
  }
};
