import mongoose from 'mongoose';

const consigneeSchema = new mongoose.Schema({
  contact: {
    name: { type: String, index: true },
    contact_person: { type: String },
    contact_number: { type: String },
  },
  address: { type: String },
  city: { type: String },
}, { timestamps: true });

const Consignee = mongoose.models.Consignee || mongoose.model('Consignee', consigneeSchema);
export default Consignee;
