import Agent from '../models/Agent.js';
import { serverError } from '../helpers/responseUtility.mjs';
import { validateRequiredFields, checkDuplicate } from '../helpers/validationUtility.mjs';

export const createAgent = async (req, res) => {
  try {
    const requiredFields = ['name'];
    const missingFields = validateRequiredFields(requiredFields, req.body);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required field${missingFields.length > 1 ? 's' : ''}: ${missingFields.join(', ')}`,
        error: true,
      });
    }

    if (req.body.gstin) {
      const duplicate = await checkDuplicate(Agent, { gstin: req.body.gstin });
      if (duplicate) {
        return res.status(409).json({
          message: 'Agent with this GST number already exists',
          error: true,
        });
      }
    }

    const agent = await Agent.create({
      ...req.body,
      created_by: req.user._id,
      organization_id: req.user.account_id,
    });

    res.status(201).json({
      message: 'Agent created successfully',
      data: agent,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

export const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ organization_id: req.user.account_id });
    res.status(200).json({
      message: 'Agents fetched successfully',
      data: agents,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

export const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findOne({
      _id: req.params.id,
      organization_id: req.user.account_id,
    });

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found', error: true });
    }

    res.status(200).json({
      message: 'Agent fetched successfully',
      data: agent,
      error: false,
    });
  } catch (error) {
    serverError(res, error);
  }
};

export const updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findOneAndUpdate(
      { _id: req.params.id, organization_id: req.user.account_id },
      { ...req.body, updated_by: req.user._id },
      { new: true }
    );

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({
      message: 'Agent updated successfully',
      data: agent,
    });
  } catch (err) {
    serverError(res, err);
  }
};

export const deleteAgent = async (req, res) => {
  try {
    const result = await Agent.findOneAndDelete({
      _id: req.params.id,
      organization_id: req.user.account_id,
    });

    if (!result) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({ message: 'Agent deleted successfully' });
  } catch (err) {
    serverError(res, err);
  }
};