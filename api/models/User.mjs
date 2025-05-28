import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  id: {
    type: Schema.Types.ObjectId,

  },
  code: {
    type: String,
  },
  name: {
    type: String,
  },
  currency: {
    type: String,
  },
});
const User = mongoose.model('User', userSchema);
export default User;
