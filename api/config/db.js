import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const mongoURI = process.env.DB_URL;

// Connect to MongoDB
const connection = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};
mongoose.set('bufferCommands', false);
mongoose.set('serverSelectionTimeoutMS', 50000);


export default connection;
