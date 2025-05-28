import mongoose from 'mongoose';

const { Schema } = mongoose;

const batchSchema = new mongoose.Schema({
  batchNo: { type: String },
  expDate: { type: String },
  qty: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  salePrice: { type: Number },
  mrp: { type: Number },
  mfgDate: { type: Date },
  createdOn: { type: Date, default: Date.now },
  lastTransactionDate: { type: Date, default: Date.now },
  purchaseEvent: [{
    purchaseId: { type: Schema.Types.ObjectId, ref: 'Purchase', required: true },
    purchaseDate: { type: Date },
    quantity: { type: Number },
    price: { type: Number },
  }], // Reference to purchase invoice if applicable
  salesEvent: [{
    salesId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    orderDate: { type: Date },
    quantity: { type: Number },
    price: { type: Number },
  }], // Reference to sales invoice if applicable
});

const InventorySchema = new mongoose.Schema({
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  openingStock: { type: Number, default: 0 },
  openingStockRatePerUnit: { type: Number, default: 0 },
  totalAvailableStock: { type: Number, default: 0 },
  batches: [batchSchema], // History of all transactions
}, { timestamps: true });

const Inventory = mongoose.model('Inventory', InventorySchema);
export default Inventory;
