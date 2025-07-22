import mongoose from 'mongoose';

const consignerSchema = new mongoose.Schema({
  name: { type: String, index: true },
  contact: {
    person: { type: String },
    phone: { type: Number},
    email: { type: String },
  },
  address: {
    adddress_line_1: { type: String },
    street: { type: String },
    state: { type: String },
    postal_code: { type: String },
    city: { type: String },
    country: { type: String },
  },
  description : { type: String },
  gstin: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
}, { timestamps: true });

const Consigner = mongoose.models.Consigner || mongoose.model('Consigner', consignerSchema);
export default Consigner;
