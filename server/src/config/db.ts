import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/projecttraker';
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected...');
    } catch (err: any) {
        console.error('Error connecting to MongoDB:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;
