import mongoose from 'mongoose';
import Shipment from '../models/Shipment.js';
import { serverError } from '../helpers/responseUtility.mjs';

export const createShipment = async (req, res) => {
  try {
    const { consigner, consignee, driver, vehicle, ...rest } = req.body;

    if (!consigner || !consignee || !driver || !vehicle) {
      return res.status(400).json({
        message: 'Missing required fields',
        error: true,
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(consigner) ||
      !mongoose.Types.ObjectId.isValid(consignee) ||
      !mongoose.Types.ObjectId.isValid(driver) ||
      !mongoose.Types.ObjectId.isValid(vehicle)
    ) {
      return res.status(400).json({
        message: 'One or more IDs are invalid ObjectId values',
        error: true,
      });
    }

    const shipment = await Shipment.create({
      consigner: new mongoose.Types.ObjectId(consigner),
      consignee: new mongoose.Types.ObjectId(consignee),
      driver: new mongoose.Types.ObjectId(driver),
      vehicle: new mongoose.Types.ObjectId(vehicle),
      ...rest,
      created_by: req.user._id,
      organization_id: req.user.account_id,
    });

    res.status(201).json({
      message: 'Shipment created successfully',
      data: shipment,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

export const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find({ organization_id: req.user.account_id })
      .populate('consigner')
      .populate('consignee')
      .populate('driver')
      .populate('vehicle')
      .populate('created_by', 'email'); 

    res.status(200).json({
      message: 'Shipments fetched successfully',
      data: shipments,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

export const updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findOneAndUpdate(
      { _id: req.params.id, organization_id: req.user.account_id },
      req.body,
      { new: true }
    );
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteShipment = async (req, res) => {
  try {
    const result = await Shipment.findOneAndDelete({
      _id: req.params.id,
      organization_id: req.user.account_id
    });
    if (!result) return res.status(404).json({ message: 'Shipment not found' });
    res.json({ message: 'Shipment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Open', 'In-Transit', 'Delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedShipment = await Shipment.findOneAndUpdate(
      { _id: id, organization_id: req.user.account_id }, 
      { status },
      { new: true }
    );

    if (!updatedShipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json({ message: 'Shipment status updated', shipment: updatedShipment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
