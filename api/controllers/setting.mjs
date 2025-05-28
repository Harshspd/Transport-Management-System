import mongoose from 'mongoose';
// import accounts from "../models/Account.mjs";
// import addresses from "../models/Address.mjs";
import Account from '../models/Account.mjs';
import Address from '../models/Address.mjs';

export const getAccountById = async (req, res) => {
  try {
    // const accountId = '6660219b41cf90333b2d4eba';
    // const {accountId} = req.params;
    const accountId = req.user.account_id;
    const account = await Account.findById(accountId).populate('address');
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching account' });
  }
};

export const fetchAccounts = async (req, res) => {
  try {
    const Accounts = await Account.find().populate('address');
    return res.json(Accounts);
  } catch (err) {
    return res.status(400).json({ error: err.message, message: 'Failed to get Accounts' });
  }
};

export const createOrUpdateAccount = async (req, res) => {
  try {
    const {
      address, currency, ...otherFields
    } = req.body;
    const existingAccountWithEmail = await Account.findOne({
      account_email: req.body.account_email,
    });

    if (existingAccountWithEmail && existingAccountWithEmail.account_email === req.body.account_email && existingAccountWithEmail._id != req.user.account_id) { return res.status(403).json({ message: 'Email is already used by another account.' }); }

    const existingAccount = await Account.findById(req.user.account_id);
    if (address) {
      const existingAddress = await Address.findById(existingAccount.address);
      const addressObject = existingAddress.toObject();
      const updatedAddress = {
        ...addressObject,
        ...address,
      };
      Object.assign(existingAddress, updatedAddress);

      await existingAddress.save();
    }

    // Update other account fields
    const updatedObject = { ...existingAccount, ...otherFields };
    Object.assign(existingAccount, updatedObject);
    if (currency) existingAccount.currency = currency;
    const updatedAccount = await existingAccount.save();

    const populatedAccount = await updatedAccount.populate('address');
    return res.status(201).json(populatedAccount);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating or updating account' });
  }
};

export const getAssociatedAccount = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    // console.log("accountId", accountId);

    // Fetch the account based on accountId
    const account = await Account.findById(accountId).select('logo name');

    if (!account) {
      // If no account found, return a 404 error
      return res.status(404).json({ error: 'Account not found' });
    }

    // console.log("account", account);
    res.json(account);
  } catch (error) {
    console.error('Error fetching account:', error); // Better logging for error
    res.status(500).json({ error: 'An error occurred while fetching account' });
  }
};
