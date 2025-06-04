import Consignee from '../models/Consignee.js';
import { serverError } from '../helpers/responseUtility.mjs';

export const createConsignee = async (req, res) => {
  try {
    const consignee = await Consignee.create(req.body);
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
    const consignees = await Consignee.find();
    res.status(200).json({
      message: 'Consignees fetched successfully',
      data: consignees,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};