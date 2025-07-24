import Rate from '../models/Rate.js';
import mongoose from 'mongoose';
import Shipment from '../models/Shipment.js';
import { serverError } from '../helpers/responseUtility.mjs';

// GET - Join Rate with Shipment data
export const getAllRates = async (req, res) => {
  try {
    const organizationId = req.user.account_id;

    const shipmentsWithRates = await Shipment.aggregate([
      {
        $match: { organization_id: new mongoose.Types.ObjectId(organizationId) },
      },
      {
        $lookup: {
          from: 'rates',
          localField: '_id',
          foreignField: 'shipment_id',
          as: 'rate_info',
        },
      },
      {
        $unwind: {
          path: '$rate_info',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          provider_rate: '$rate_info.provider_rate',
          consigner_rate: '$rate_info.consigner_rate',
        },
      },
      {
        $project: {
          rate_info: 0,
        },
      },
    ]);

    res.status(200).json({
      message: 'Shipments with rate info fetched successfully',
      data: shipmentsWithRates,
      error: false,
    });
  } catch (error) {
    console.error('Error fetching shipments with rates:', error);
    serverError(res);
  }
};




export const upsertRate = async (req, res) => {
  try {
    const { shipment_id, provider_rate, consigner_rate } = req.body;

    const updatedRate = await Rate.findOneAndUpdate(
      { shipment_id },
      { provider_rate, consigner_rate },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(updatedRate);
  } catch (error) {
    console.error('Error upserting rate:', error);
    serverError(res);
  }
};


