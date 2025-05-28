import jwt, { decode } from 'jsonwebtoken';
import User from '../models/Users.mjs';
import Otp from '../models/Otp.mjs';
import { serverError } from '../helpers/responseUtility.mjs';

export const otpCheck = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    let checkOtp;
    if(req?.user){
      checkOtp=await Otp.findOne({ userId: req?.user?.userId });
    }
    else
       checkOtp = await Otp.findOne({ email: email });
    if (checkOtp && checkOtp.otp === otp) {
      await checkOtp.deleteOne();
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Incorrect OTP',
        error: 'OTP mismatch',
      });
    }
  } catch (err) {
    return serverError(res, err);
  }
};

export const authCheck = async (req, res, next) => {
  try {
    const token = req.header('Authorization') || '';
    if (!token) {
      return res.status(401).json({
        message: 'You need to login first',
        error: 'Unauthorized',
      });
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: 'Unauthorized.You need to login' });
    }
  } catch (err) {
    return serverError(res, err);
  }
};

export const accountLockCheck = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) { return res.status(400).json({ message: 'User not Found', error: 'Invalid Credentials:Email not registered' }); }

    if (user.account_locked) {
      const lastLoginAttemptTime = user.last_login_attempt_time;
      const timeLimit = 30 * 60 * 1000; // 30 min converted to miliseconds
      const timeLeft = Date.now() - lastLoginAttemptTime;

      if (timeLeft > timeLimit) {
        user.account_locked = false;
        user.no_of_attempts = 0;
        await user.save();
        next();
      } else {
        const timeLeftToUnlock = Math.round(30 - (timeLeft / (1000 * 60)));
        return res.status(403).json({ message: `Account is locked. Try again in ${timeLeftToUnlock} mins`, linkMessage: 'You can unlock your account <a href="/unlock-account">here</a>.', error: 'Too many unsuccessful login attempts' });
      }
    } else { next(); }
  } catch (err) {
    return serverError(res, err);
  }
};
