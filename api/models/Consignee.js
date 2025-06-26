import mongoose from 'mongoose';

const consigneeSchema = new mongoose.Schema({
  contact: {
    name: { type: String, index: true },
    contact_person: { type: String },
    contact_number: { type: String },
  },
  address: { type: String },
  city: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },

}, { timestamps: true });

const Consignee = mongoose.models.Consignee || mongoose.model('Consignee', consigneeSchema);
export default Consignee;
