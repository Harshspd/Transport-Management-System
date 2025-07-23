import mongoose from 'mongoose';

const transportModeSchema = new mongoose.Schema({
  name: { type: String, index: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
}, { timestamps: true });

const TransportMode = mongoose.models.TransportMode || mongoose.model('TransportMode', transportModeSchema);
export default TransportMode;
