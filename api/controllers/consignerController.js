import Consigner from '../models/Consigner.js';
import { serverError } from '../helpers/responseUtility.mjs';

export const createConsigner = async (req, res) => {
  try {
    const consigner = await Consigner.create(req.body);
    res.status(201).json({
      message: 'Consigner created successfully',
      data: consigner,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

export const getAllConsigners = async (req, res) => {
  try {
    const consigners = await Consigner.find();
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
    const consigner = await Consigner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!consigner) return res.status(404).json({ message: 'Consigner not found' });
    res.json(consigner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const deleteConsigner = async (req, res) => {
  try {
    const result = await Consigner.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Consigner not found' });
    res.json({ message: 'Consigner deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};