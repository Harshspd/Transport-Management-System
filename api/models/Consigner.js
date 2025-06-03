import mongoose from 'mongoose';

const consignerSchema = new mongoose.Schema({
  name: { type: String, index: true },
  contact_person: { type: String },
  address: { type: String },
  contact_number: { type: String },
  gst_in: { type: String },
}, { timestamps: true });

const Consigner = mongoose.models.Consigner || mongoose.model('Consigner', consignerSchema);
export default Consigner;
