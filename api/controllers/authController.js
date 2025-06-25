import User from '../models/Users.mjs';
import Account from '../models/Account.mjs';
import { sendEmail } from '../helpers/emailHelper.mjs';
import Otp from '../models/Otp.mjs';
import {
  validateEmail, validatePassword, hashPassword, verifyPassword, randomOtp,
} from '../helpers/authUtility.mjs';
import { otpByMail } from '../email/otpMailTemplate.mjs';
import { generateTokenAndRespond, incrementLoginAttempts } from '../helpers/userUtility.mjs';
import { serverError } from '../helpers/responseUtility.mjs';
import Address from '../models/Address.mjs';
import jwt from 'jsonwebtoken';

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const no_of_attempts = user.no_of_attempts || 1;
    const passwordCheck = await verifyPassword(password, user.password);
    if (!passwordCheck) {
      await incrementLoginAttempts(user);
      return res.status(401).json({
        message: `Password not matched.Attempts left:${5 - no_of_attempts}`,
        error: 'Invalid Credentials:Incorrect Password',
      });
    }
    generateTokenAndRespond(user, res);
  } catch (error) { serverError(res, error); }
};

export const signup = async (req, res) => {
   console.log(req.body)

  const { email, password ,companyName,fName,lName } = req.body;
  if (!email || !password || !validateEmail(email) || !validatePassword(password)) {
    return res.status(400).json({
      message: 'Failed to create account',
      error: 'Invalid parameters :Valid Email and Password are required',
    });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: 'Email already registered.Proceed to login',
        error: 'User Already Exists',
      });
    }
   
    const newAddress = new Address({});
    const newAdd = await newAddress.save();
    const newAccount = new Account({ account_email: email, address: newAdd._id, name:companyName,first_name:fName,last_name:lName });
    const newAcc = await newAccount.save();
     const encryptedPassword = await hashPassword(password);
    const newUser = new User({
      email, account_id: newAcc._id,password: encryptedPassword 
    });
    await newUser.save();
    
    const token = jwt.sign({ _id: newUser.id, email: newUser.email,account_id:newUser.account_id }, process.env.SECRET);
    
    res.status(200).json({
      token,
      user:newUser,
      message: 'Account created successfully',
      error: false,
      
    });
  } catch (error) { serverError(res, error); }
};

export const generateOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const { mode } = req.query;
    if (process.env.SIGNUP === 'false' && mode === 'new') return res.status(400).json({ message: 'Operation Not Allowed',error: 'Invalid Action', });

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Valid email required', error: 'Invalid Parameters' });
    }
    const user = await User.findOne({ email }); 
    if (mode === 'new' && user) { return res.status(403).json({ message: 'Email Already registered', error: 'Email already registered' }); }
    if (mode !== 'new' && !user) return res.status(404).json({ success: false, message: 'User not found' });
    const otpValue = randomOtp();
    if (!user) {
      const otpexist = await Otp.findOneAndUpdate({ email }, { otp: otpValue });
      if (!otpexist) {
        const newOtp = new Otp({ email, otp: otpValue });
        await newOtp.save();
      }
    } else {
      const otpexist = await Otp.findOneAndUpdate({ email }, { otp: otpValue });
      if (!otpexist) {
        const newOtp = new Otp({ email, otp: otpValue,userId:user._id });
        await newOtp.save();
      }
    }
    const recipient = email;
    const subject = 'One Time Password';
    const htmlContent = otpByMail(otpValue);
    sendEmail(recipient, subject, htmlContent)
      .then(() => console.log('Email sent successfully'))
      .catch((error) => console.error('Failed to send email:', error));

    res.status(200).json({ message: 'OTP generated successfully' });
  } catch (error) { serverError(res, error); }
};

export const unlockAccount = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Valid email required', error: 'Invalid Parameters' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.updateOne({ account_locked: false, no_of_attempts: 0 });

    res.status(200).json({
      message: 'Account Unlocked successfully',
      error: false,
    });
  } catch (error) { serverError(res, error); }
};

export const changePassword = async (req, res) => {
  try {
   
    const { newPassword, email } = req.body;
    if(req?.user?.account_id)
      {
        const user=await User.findOne({account_id:req.user.account_id});
        console.log(req.body.password,user.password)
        const passwordMatched=await verifyPassword(req.body.password,user.password);
        console.log(passwordMatched);
        if(!passwordMatched)
            return res.status(403).json({
              message: `Current Password is Invalid`,
              error: 'Invalid Credentials:Incorrect Password',
            });
      }
    if (!newPassword || !email) {
      res.status(400).json({ message: 'Email and Password required', err: 'Invalid Parameter:email,newPassword required' });
    }
    const user = await User.findOne({ email });

    const hashedNewPassword = await hashPassword(newPassword);
    await user.updateOne({ password: hashedNewPassword ,account_locked: false, no_of_attempts: 0 });

    res.status(200).json({
      message: 'Password Changed successfully',
    });
  } catch (error) { serverError(res, error); }
};

export const changeAccountEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const account_id=req.user.account_id;
    if (!email) {
      res.status(400).json({ message: 'Email required', err: 'Invalid Parameter:email required' });
    }
   
 
      await User.findOneAndUpdate({ account_id }, { email });
      await Account.findByIdAndUpdate(account_id, { account_email: email });
    
    
    res.status(200).json({
      message: 'Password Changed successfully',
    });
  } catch (error) { 
    
    serverError(res, error); 
  }
};


export const registerUserUnderOrg = async (req, res) => {
  try {
    const { email, password } = req.body;
    const account_id = req.user.account_id; // Get org from logged-in user

    if (!email || !password || !validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({
        message: 'Invalid input',
        error: 'Email and password required and must be valid',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        message: 'User already exists',
        error: 'Duplicate user',
      });
    }

    const encryptedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      password: encryptedPassword,
      account_id, // Attach same org
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered under organization successfully',
      user: newUser,
    });
  } catch (error) {
    serverError(res, error);
  }
};
