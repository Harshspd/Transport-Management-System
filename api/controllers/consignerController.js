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