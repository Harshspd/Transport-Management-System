import mongoose from 'mongoose';

const { Schema } = mongoose;

const accountSchema = new Schema({
  name: {
    type: String,
    index: true,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  gstno: {
    type: String,
  },
  panno: {
    type: String,
  },
  company_registeration_no: { type: String },
  account_email: {
    type: String,
    unique: true,
    index: true,
  },
  public_email: {
    type: String,
    index: true,
  },
  mobile: {
    type: String,
  },
  site_url: {
    type: String,
  },
  information: {
    type: String,
  },
  logo: {
    type: String,
  },
  address: {
    type: Schema.Types.ObjectId, ref: 'Address',
  },
  currency: {
    type: Schema.Types.ObjectId, ref: 'Country',
  },
  fiscal_year: {
    type: Object,
    default: {
      start_month: 1, end_month: 12, start_day: 1, end_day: 31,
    },
  },
  additional_fields: {
    type: Object,
  },
  invoiceSettings: {
    type: Object, default: { prefix: 'INV-' },
  },
  estimateSettings: {
    type: Object,
  },
  notificationSettings: {
    type: Object,
  },
});

const Account = mongoose.models.Account || mongoose.model('Account', accountSchema);
export default Account;
