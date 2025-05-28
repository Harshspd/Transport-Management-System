import mongoose from 'mongoose';

const { Schema } = mongoose;
const Otp = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  otp: 'string',
  email: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '5m',
  },
});

const OtpModel = mongoose.model('Otp', Otp);
export default OtpModel;
