import Consignee from '../models/Consignee.js';
import { serverError } from '../helpers/responseUtility.mjs';
import { validateRequiredFields, checkDuplicate } from '../helpers/validationUtility.mjs';

// Create
export const createConsignee = async (req, res) => {
  try {
    // 1. Required fields check
    const requiredFields = ['name', 'contact.phone'];
    const missingFields = validateRequiredFields(requiredFields, req.body);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required field${missingFields.length > 1 ? 's' : ''}: ${missingFields.join(', ')}`,
        error: true,
      });
    }

    // 2. Duplicate check on gst
    if (req.body.gstin) {
      const duplicate = await checkDuplicate(Consignee, { gstin: req.body.gst_in });
      if (duplicate) {
        return res.status(409).json({
          message: 'Consignee with this GST number already exists',
          error: true,
        });
      }
    }

    // 3. Save new consignee
    const consignee = await Consignee.create({
      ...req.body,
      created_by: req.user._id,
      organization_id: req.user.account_id,
    });

    res.status(201).json({
      message: 'Consignee created successfully',
      data: consignee,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Get All
export const getAllConsignees = async (req, res) => {
  try {
    const consignees = await Consignee.find({ organization_id: req.user.account_id });
    res.status(200).json({
      message: 'Consignees fetched successfully',
      data: consignees,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Update
export const updateConsignee = async (req, res) => {
  try {
    const updated = await Consignee.findOneAndUpdate(
      { _id: req.params.id, organization_id: req.user.account_id },
      { ...req.body, updated_by: req.user._id },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Consignee not found' });

    res.status(200).json({
      message: 'Consignee updated successfully',
      data: updated,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// Delete
export const deleteConsignee = async (req, res) => {
  try {
    const deleted = await Consignee.findOneAndDelete({
      _id: req.params.id,
      organization_id: req.user.account_id,
    });

    if (!deleted) return res.status(404).json({ message: 'Consignee not found' });

    res.status(200).json({ message: 'Consignee deleted successfully' });
  } catch (error) {
    serverError(res, error);
  }
};
