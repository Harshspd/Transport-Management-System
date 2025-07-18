import Rate from '../models/Rate.js';
import Shipment from '../models/Shipment.js';
import { serverError } from '../helpers/responseUtility.mjs';

// GET - Join Rate with Shipment data
export const getAllRates = async (req, res) => {
  try {
    console.log('Current user org ID:', req.user.organization_id);
    const organizationId = req.user.account_id;

    const rates = await Rate.find()
      .populate({
        path: 'shipment_id',
        match: { organization_id: organizationId },
        select: '-__v' 
      })
      .select('shipment_id provider_rate consigner_rate'); 

    // Filter out null shipments (from unmatched organization_id)
    const filteredRates = rates.filter(rate => rate.shipment_id !== null);

    res.status(200).json(filteredRates);
    console.log("asdfghjukl");
  } catch (error) {
    console.error('Error fetching joined rate data:', error);
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


