import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: { type: String },
  license_number: { type: String },
  address: { type: String },
  contact_number: { type: String },
  license_file: { type: String }, // File path or URL
}, { timestamps: true });

const Driver = mongoose.models.Driver || mongoose.model('Driver', driverSchema);
export default Driver;
