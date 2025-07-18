import mongoose from 'mongoose';

const rateSchema = new mongoose.Schema({
  shipment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipment',
    required: true,
    unique: true, 
  },
  provider_rate: {
    type: Number,
    required: true,
  },
  consigner_rate: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Rate = mongoose.model('Rate', rateSchema);

export default Rate;
