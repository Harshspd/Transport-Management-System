import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicle_number: { type: String },
  vehicle_type: { type: String },
  capacity_weight: { type: Number },
  capacity_volume: { type: Number },
  rc_number: { type: String },
  rc_file: { type: String }, // File path or URL
}, { timestamps: true });

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
