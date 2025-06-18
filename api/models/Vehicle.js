import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicle_number: { type: String },
  vehicle_type: { type: String },
  capacity_weight: { type: Number },
  capacity_volume: { type: Number },
  rc_number: { type: String },
  rc_file: { type: String }, // File path or URL
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }, 
}, { timestamps: true });

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
