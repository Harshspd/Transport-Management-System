import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  contact: {
    name: { type: String },
    contact_number: { type: Number },
  },
  license_number: { type: String },
  address: { type: String },
  city: { type: String },
  license_file: { type: String }, // File path or URL
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },

}, { timestamps: true });

const Driver = mongoose.models.Driver || mongoose.model('Driver', driverSchema);
export default Driver;
