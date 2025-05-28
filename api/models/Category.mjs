// Import required modules
import mongoose from 'mongoose';

const { Schema } = mongoose;
const categorySchema = new mongoose.Schema({

  name: { type: String, index: true },

  subcategories: [{
    id: { type: String },
    name: { type: String, index: true },
  },

  ],

  archived: { type: Boolean, default: false },

  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
  account_id:{ type: Schema.Types.ObjectId, ref: 'Account',require:true}
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
