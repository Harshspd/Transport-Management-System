import Consignee from '../models/Consignee.js';
import { serverError } from '../helpers/responseUtility.mjs';

export const createConsignee = async (req, res) => {
  try {
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


// Update Consignee
export const updateConsignee = async (req, res) => {
  try {
   const updated = await Consignee.findOneAndUpdate(
  { _id: req.params.id, organization_id: req.user.account_id },
  { ...req.body, updated_by: req.user._id },
  { new: true }
);
    if (!updated) return res.status(404).json({ message: 'Consignee not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete Consignee
export const deleteConsignee = async (req, res) => {
  try {
    const deleted = await Consignee.findOneAndDelete({
  _id: req.params.id,
  organization_id: req.user.account_id
});
    if (!deleted) return res.status(404).json({ message: 'Consignee not found' });
    res.status(200).json({ message: 'Consignee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};