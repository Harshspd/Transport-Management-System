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
        $match: {
          organization_id: new mongoose.Types.ObjectId(organizationId),
        },
      },
      {
        $lookup: {
          from: 'rates',
          localField: '_id',
          foreignField: 'shipment_id',
          as: 'rate',
        },
      },
      {
        $unwind: {
          path: '$rate',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'consigners',
          localField: 'consigner',
          foreignField: '_id',
          as: 'consigner',
        },
      },
      {
        $unwind: {
          path: '$consigner',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'consignees',
          localField: 'consignee',
          foreignField: '_id',
          as: 'consignee',
        },
      },
      {
        $unwind: {
          path: '$consignee',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'agents',
          localField: 'agent',
          foreignField: '_id',
          as: 'agent',
        },
      },
      {
        $unwind: {
          path: '$agent',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          provider_rate: '$rate.provider_rate',
          consigner_rate: '$rate.consigner_rate',
        },
      },
      {
        $project: {
          rate: 0,
        },
      },
    ]);

    res.status(200).json({
      message: 'Shipments with rate info and populated details fetched successfully',
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


