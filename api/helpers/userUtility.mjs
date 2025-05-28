import jwt from 'jsonwebtoken';
import { serverError } from './responseUtility.mjs';
import Account from '../models/Account.mjs';
import User from '../models/Users.mjs';

/*
*Utility function to increment login attempts
*/
export const incrementLoginAttempts = async (user) => {
  const no_of_attempts = (user.no_of_attempts || 0) + 1;
  user.no_of_attempts = no_of_attempts;
  user.last_login_attempt_time = Date.now();

  if (no_of_attempts >= 5) {
    user.account_locked = true;
  }

  await user.save();
};

/*
*Utility function for successful login and return a access token
*/

export const generateTokenAndRespond = async (user, res) => {
  const token = jwt.sign({ _id: user.id, email: user.email,account_id:user.account_id }, process.env.SECRET);

  const account = await Account.findOne({ _id: user.account_id });

  await user.updateOne({ no_of_attempts: 0, lastLoginAttemptTime: Date.now() });
  const userData=user.toObject()
  delete userData.password
  delete userData.password_date

  res.status(200).json({
    user:userData,
    account,
    token,
    message: 'Logged in successfully',
    error: false,
    success: true
  });
};
