import mongoose from 'mongoose';
import Account from '../models/Account.mjs';
import UserService from '../services/UserService.mjs';

export const getUserById = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const userId = req.user._id;
    console.log(accountId);
    console.log(userId);
    const account = await Account.findById(accountId).populate('address');
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    let user = await UserService.getUserById(userId);
     res.status(201).json({
      message: 'user get successfully',
      "user": user,
      error: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching account' });
  }
};