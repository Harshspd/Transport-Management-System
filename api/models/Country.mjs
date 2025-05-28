// Import required modules
import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  id: { type: String },
  code: {
    type: String, 
  },
  name: {
    type: String,
  },
  currency: {
    type: String,
  },
});

const Country = mongoose.model('Country', countrySchema);

export default Country;
