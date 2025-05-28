import mongoose from 'mongoose';

const { Schema } = mongoose;

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: String,
  sku: { type: String }, // Unique identifier for the item
  hsncode: String, // For tax purposes
  category: { type: Schema.Types.ObjectId, ref: 'Category' }, // Linked to a category
  subcategory: { type: Schema.Types.ObjectId },
  cost: { type: Number }, // cost price
  price: { type: Number }, // selling price
  taxable: { type: Boolean, default: false }, // Whether the item is taxable
  taxes: [{ type: Schema.Types.ObjectId, ref: 'Tax' }],
  archived: { type: Boolean, default: false }, // Soft delete
  account_id: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' }, // User reference for audit
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  isInventoryManaged: { type: Boolean },
  taxMode: { type: String, enum: ['nongst', 'nontaxable', 'gst', 'taxable'] },
  isBatchInventory: { type: Boolean },
  type: {
    type: String, enum: ['goods', 'services'], required: true, default: 'services',
  },
  unitType: String,
});

const Item = mongoose.model('Item', itemSchema);
export default Item;
