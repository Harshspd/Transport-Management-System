import mongoose from 'mongoose';

const consigneeSchema = new mongoose.Schema({
  name: { type: String, index: true },
  contact: {
    person: { type: String },
    phone: { type: String },
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
  gstin: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
}, { timestamps: true });

const Consignee = mongoose.models.Consignee || mongoose.model('Consignee', consigneeSchema);
export default Consignee;
