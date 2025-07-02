import Consigner from '../models/Consigner.js';
import { serverError } from '../helpers/responseUtility.mjs';
import { validateRequiredFields, checkDuplicate } from '../helpers/validationUtility.mjs';

// Create
export const createConsigner = async (req, res) => {
  try {
    // Step 1: Dynamic Required Field Validation
    const requiredFields = ['name', 'contact.phone'];
    const missingFields = validateRequiredFields(requiredFields, req.body);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required field${missingFields.length > 1 ? 's' : ''}: ${missingFields.join(', ')}`,
        error: true,
      });
    }

    // Step 2: Duplicate Check on contact.phone
    const duplicate = await checkDuplicate(Consigner, { 'contact.phone': req.body.contact.phone });
    if (duplicate) {
      return res.status(409).json({
        message: 'Consigner with this contact number already exists',
        error: true,
      });
    }

    // Step 3: Create
    const consigner = await Consigner.create({
      ...req.body,
      created_by: req.user._id,
      organization_id: req.user.account_id,
    });

    res.status(201).json({
      message: 'Consigner created successfully',
      data: consigner,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Get All
export const getAllConsigners = async (req, res) => {
  try {
    const consigners = await Consigner.find({ organization_id: req.user.account_id });
    res.status(200).json({
      message: 'Consigners fetched successfully',
      data: consigners,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Update
export const updateConsigner = async (req, res) => {
  try {
    const consigner = await Consigner.findOneAndUpdate(
      { _id: req.params.id, organization_id: req.user.account_id },
      { ...req.body, updated_by: req.user._id },
      { new: true }
    );

    if (!consigner) {
      return res.status(404).json({ message: 'Consigner not found' });
    }

    res.json({
      message: 'Consigner updated successfully',
      data: consigner,
    });
  } catch (err) {
    serverError(res, err);
  }
};

// Delete
export const deleteConsigner = async (req, res) => {
  try {
    const result = await Consigner.findOneAndDelete({
      _id: req.params.id,
      organization_id: req.user.account_id
    });

    if (!result) {
      return res.status(404).json({ message: 'Consigner not found' });
    }

    res.json({ message: 'Consigner deleted successfully' });
  } catch (err) {
    serverError(res, err);
  }
};
