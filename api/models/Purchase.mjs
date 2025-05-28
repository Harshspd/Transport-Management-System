
import mongoose from 'mongoose';

const { Schema } = mongoose;

const purchaseSchema = new Schema({
  // TODO : change recieptNO to PurchaseNum
  receiptNumber: { type: String, required: true, unique: true }, // system generated
  purchaseDate: { type: Date, default: Date.now },
  serialNumber: { type: Number }, // for generting recioept number
  vendor: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  vendorInvoiceNumber: { type: String },
  vendorInvoiceDate: { type: Date, default: Date.now }, // Date of invoice generation
  status: { type: String, enum: ['ordered', 'received', 'canceled', 'invoiced'], default: 'ordered' },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  items: [{
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    itemTax: [{
      type: Schema.Types.ObjectId,
      ref: 'Tax',
    }],
    batchNo: { type: String },
    quantity: { type: Number, required: true },
    costPrice: { type: Number, required: true, default: 0 },
    salePrice: { type: Number },
    mrp: { type: Number },
    mfgDate: { type: Date },
    expDate: { type: Date },
    createdOn: { type: Date, default: Date.now },
  }],
  salesInvoice: [{ type: Schema.Types.ObjectId, ref: 'Invoice'}],
  statusChangeLog: [{
    status: { type: String, enum: ['ordered', 'received', 'canceled', 'invoiced'], required: true }, // The status that was changed to
    changedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional: the user who made the change
    changedAt: { type: Date, default: Date.now }, // Timestamp of the status change
  }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, // User reference for audit
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  accountTag: String,
}, { timestamps: true });

// Create models
const Purchase = mongoose.model('Purchase', purchaseSchema);
export default Purchase;
