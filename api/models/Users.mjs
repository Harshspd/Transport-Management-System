import moongose from 'mongoose';

const userSchema = moongose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  password_date: Date,
  last_login_attempt_time: Date,
  account_locked: Boolean,
  no_of_attempts: Number,
  account_id: { type: moongose.Schema.Types.ObjectId, ref: 'Account' },
});

const User = moongose.model('User', userSchema);

export default User;
