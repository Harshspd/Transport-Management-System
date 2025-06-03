import mongoose from 'mongoose';

const consigneeSchema = new mongoose.Schema({
  name: { type: String, index: true },
  contact_person: { type: String },
  address: { type: String },
  contact_number: { type: String },
}, { timestamps: true });

const Consignee = mongoose.models.Consignee || mongoose.model('Consignee', consigneeSchema);
export default Consignee;
