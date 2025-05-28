import mongoose, { Types, model } from "mongoose";
const {Schema} = mongoose;

const addressSchema = new Schema ({
    address_line_1: { type: String },
    address_line_2: { type: String },
    city: { type: String },
    state: { type: String },
    postal_code: { type: String },
    country_id: { type: Schema.Types.ObjectId, ref: 'Country' ,  default: null },
    // currency: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Address = mongoose.model('Address',addressSchema);

export default Address;