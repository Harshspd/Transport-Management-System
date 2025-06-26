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
const UserNotUsed = mongoose.model('User12', userSchema);
export default UserNotUsed;
