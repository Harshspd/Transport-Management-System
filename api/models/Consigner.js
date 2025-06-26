import mongoose from 'mongoose';

const consignerSchema = new mongoose.Schema({
  contact: {
    name: { type: String, index: true },
    contact_person: { type: String },
    contact_number: { type: Number},
  },
  address: { type: String },
  city: { type: String },
  gst_in: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
}, { timestamps: true });

const Consigner = mongoose.models.Consigner || mongoose.model('Consigner', consignerSchema);
export default Consigner;
