import mongoose from 'mongoose';

const { Schema } = mongoose;

const invoiceSchema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  estimate: { type: Schema.Types.ObjectId, ref: 'Estimate' },
  client: {
    client_id: { type: Schema.Types.ObjectId, ref: 'Client' },
    billing_address: { type: Schema.Types.ObjectId, ref: 'Address' },
    shipping_address: { type: Schema.Types.ObjectId, ref: 'Address' },
  },
  issued_date: { type: Date },
  due_date: { type: Date },
  currency: { type: Schema.Types.ObjectId, ref: 'Country' },
  language: { type: String },
  invoice_number: { type: String, index: true },
  reference_number: { type: String },
  items: [{
    item: { type: Schema.Types.ObjectId, ref: 'Item' },
    quantity: { type: Number },
    line_total: { type: Number },
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    itemTax: [{
      type: Schema.Types.ObjectId,
      ref: 'Tax',
    }],
    batchNo: { type: String },
    expDate: { type: Date },
  }],
  discounts: [{
    name: { type: String },
    rate: { type: Number },
    amount: { type: Number },
  }],
  taxes: [{
    tax_id: { type: Schema.Types.ObjectId, ref: 'Tax' },
    name: { type: String },
    rate: { type: Number },
    amount: { type: Number },
  }],
  status_log: [{
    status: { type: String },
    updated_on: { type: Date },
  }],
  transactions: [{
    type: { type: String, enum: ['payment', 'deposit', 'refund'] },
    date: { type: Date },
    amount: { type: Number },
    rate: { type: Number },
    description: { type: String },
    payment_reference: { type: String, default: null }, // New field - Reference ID
  }],
  subtotal: { type: Number },
  total: { type: Number },
  tax_total: { type: Number },
  notes: { type: String },
  terms: { type: String },
  attachments: { type: String },
  status: { type: String },
  total_deposit: { type: Number, default: 0 },
  total_payment: { type: Number, default: 0 },
  amount_due: { type: Number },
  amount_refund: { type: Number },
  refund: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  reminder_invoice: { type: Boolean, default: false },
  sent: { type: Boolean, default: false },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
  last_email_sent: { type: Date },
  pdf: { type: String },
  serial_no: { type: Number },
  credit_note_no: { type: String },
  billingPeriodStart: { type: Date },
  billingPeriodEnd: { type: Date },

  // Updated Deposits Section
  deposits: [{
    depositAmount: { type: Number, required: true },
    description: { type: String, default: '' },
    percentage: { type: Number, default: 0 },
    depositDate: { type: Date, default: null }, // New field - Date of deposit
    status: { type: String, enum: ['pending', 'paid', 'refunded', 'failed'], default: 'pending' }, // New field - Status
    deposite_reference: { type: String, default: null }, // New field - Reference ID
  }],
});

// Auto-update existing documents
invoiceSchema.pre('save', function (next) {
  if (this.deposits && this.deposits.length > 0) {
    this.deposits = this.deposits.map((deposit) => ({
      depositAmount: deposit.depositAmount || 0,
      description: deposit.description || '',
      percentage: deposit.percentage || 0,
      depositDate: deposit.depositDate || null, // Set default date if missing
      status: deposit.status || 'pending', // Ensure status is set
    }));
  }
  next();
});

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
export default Invoice;
