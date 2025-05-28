import mongoose from 'mongoose';

const { Schema } = mongoose;
const taxSchema = new Schema({

  name: { type: String, index: true },

  rate: { type: Number },

  archived: { type: Boolean, default: false },

  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
  account_id:{ type: Schema.Types.ObjectId, ref: 'Account',require:true}

});

const Tax = mongoose.model('Tax', taxSchema);

export default Tax;
