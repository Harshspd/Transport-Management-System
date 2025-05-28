import Account from "../models/Account.mjs";
import Estimate from "../models/Estimate.mjs";
import AccountService from "./AccountService.mjs";
import ItemService from "./ItemService.mjs";

class EstimateService {
    getSerialNumber(estimateNumber) {
        const match = estimateNumber.match(/\d+$/); // Match digits at the end of the string
        if (match) {
          return match[0]; // Return the matched digits
        }
        throw new Error('Invalid Estimate Number Format');
      }
    async isEstimateNumberUnique(accountId,estimateNumber,estimateId = null) {
        const estimate = await Estimate.findOne({
          estimate_number_number: estimateNumber,
          account: accountId,
        });
    
        // case for self edit
    
        if (estimateId && estimate && (estimateId, (estimate._id).toString() === estimateId)) {
          return true;
        }
        // this is case edit and add
        return !estimate;
      }
    async generateEstimateNumber (account_id){
        try {
          // Fetch account details to get the current prefix
          const account = await Account.findById(account_id);
          const prefix = account?.estimateSettings?.prefix || 'EST';
      
          const estimate = await Estimate.findOne({ account: account_id })
            .sort({ serial_no: -1 })
            .exec();
      
          // Determine the next serial number
          const newSerialNo = (estimate && estimate.serial_no) ? estimate.serial_no + 1 : 1;
          // Pad the serial number to 4 digits
          const paddedNumber = newSerialNo.toString().padStart(4, '0');
          return { estimateNumber: `${prefix}${paddedNumber}`, newSerialNo };
        } catch (error) {
          console.error('Error generating Estimate number:', error);
          throw new Error('Error generating Estimate number');
        }
      };
    async createAutomatedEstimate(estimate, account_id) {

        try {

            const items = await ItemService.processAndValidateItems(estimate.items, account_id);
            const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

            const issued_date = new Date();
            const due_date = new Date(issued_date);           
            due_date.setDate(due_date.getDate() + 30);
            let newSerialNo, estimateNumber, isUnique;
            if (estimate?.estimate_number) {
                estimateNumber = estimate?.estimate_number
                isUnique = await this.isEstimateNumberUnique(account_id, estimateNumber);
                newSerialNo = this.getSerialNumber(estimateNumber);
            }

            if (!isUnique || !estimate?.estimate_number) {

                const newEstimateNumber = await this.generateEstimateNumber(account_id);
                newSerialNo = newEstimateNumber.newSerialNo;
                estimateNumber = newEstimateNumber.estimateNumber;
            }


            let taxTotal = 0;
            items.forEach(item => {
                if (item.taxable) {
                    const itemTaxTotal = item.itemTax.reduce((sum, tax) => sum + (item.price * (tax.rate / 100)), 0);
                    taxTotal += itemTaxTotal * item.quantity;
                }
            });
            const existingAccount = AccountService.getAccountById(account_id);

            const total = subtotal + taxTotal;
            const newEstimate = new Estimate({
                account: account_id,
                client: { client_id: estimate.client, billing_address: null, shipping_address: null },
                issued_date,
                due_date,
                serial_no: newSerialNo,
                estimate_number: estimateNumber,
                
                currency: estimate.currency || existingAccount?.currency,
                items,
                taxes: [
                    ...Array.from(
                        new Map(
                            items.flatMap(item =>
                                item.itemTax.map(tax => [
                                    `${tax._id}_${tax.name}_${tax.rate}`,  // Unique key: tax_id + name + rate
                                    {
                                        tax_id: tax._id,
                                        name: tax.name,
                                        rate: tax.rate,
                                        amount: item.price * (tax.rate / 100) * item.quantity,  // Calculated tax amount
                                    }
                                ])
                            )
                        ).values()  // Extract the unique tax objects
                    )
                ],
                subtotal,
                tax_total: taxTotal,
                total,
                notes: estimate?.notes || existingAccount?.estimateSettings?.notes,
                terms: estimate?.terns || existingAccount?.estimateSettings?.terms,
                status: 'Created',
                language: 'English',
                amount_due: total,
                created_by: account_id,
            });

            newEstimate.status_log.push({ status: 'Created', updated_on: Date.now() });

            return await newEstimate.save();


        } catch (error) {
            console.error('Error interacting with OpenAI:', error);
            throw Error({ error: 'Failed to generate estimate. Please try again.' });
        }
    }
}

export default new EstimateService(); // Exporting an instance of the class
