import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema({
  consigner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consigner',
    required: true,
  },
  consignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consignee',
    required: true,
  },
  delivery_location: { type: String, required: true },
  date_time: { type: Date, required: true },

  goods_details: {
    description: { type: String },
    quantity: { type: Number },
    bill_no: { type: String },
    value: { type: Number },
    mode: { type: String },
    actual_dimensions: { type: Number },
    charged_dimensions: { type: Number },
    unit_of_weight: { type: String },
    actual_weight: { type: Number },
    charged_weight: { type: Number },
    special_instructions: { type: String },
  },

  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },

  service_type: { type: String },
  provider: { type: String },
  eway_bill_number: { type: String },
  status: {
  type: String,
  enum: ['Open', 'In-Transit', 'Delivered'],
  default: 'Open',
  },
   created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
   },
   organization_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
}, { timestamps: true });

const Shipment = mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema);
export default Shipment;
