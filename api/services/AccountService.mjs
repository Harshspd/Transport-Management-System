import Account from '../models/Account.mjs';

class AccountService {
  async getAccountById(accountId) {
    try {
      return await Account.findById(accountId);
    } catch (error) {
      throw new Error(`Error fetching invoice: ${error.message}`);
    }
  }

  async updateInvoicePrefix(accountId, prefix) {
    await Account.findByIdAndUpdate(
      accountId,
      { 'invoiceSettings.prefix': prefix },

      { new: true, runValidators: true },
    );
  }
}
export default new AccountService(); // Exporting an instance of the class
