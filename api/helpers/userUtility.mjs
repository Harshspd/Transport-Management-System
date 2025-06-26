import jwt from 'jsonwebtoken';
import { serverError } from './responseUtility.mjs';
import Account from '../models/Account.mjs';
import User from '../models/Users.mjs';

/*
 * Utility function to increment login attempts
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
 * Utility function to generate JWT token
 */
export const generateUserToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      account_id: user.account_id,
    },
    process.env.SECRET,
    { expiresIn: '1d' }
  );
};

/*
 * Utility function to respond on successful login
 */
export const generateTokenAndRespond = async (user, res) => {
  try {
    const token = generateUserToken(user);

    const account = await Account.findById(user.account_id).populate('address'); // Optional: enrich data

    await user.updateOne({
      no_of_attempts: 0,
      last_login_attempt_time: Date.now(),
    });

    const userData = user.toObject();
    delete userData.password;
    delete userData.password_date;

    res.status(200).json({
      user: userData,
      account,
      token,
      message: 'Logged in successfully',
      error: false,
      success: true,
    });
  } catch (error) {
    serverError(res, error);
  }
};
