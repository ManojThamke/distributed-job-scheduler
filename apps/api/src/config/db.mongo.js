import mongoose from 'mongoose';

export async function connectMongo() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        throw error;

        process.exit(1); // Exit the process with an error code
    }
}