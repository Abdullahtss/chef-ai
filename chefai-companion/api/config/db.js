import mongoose from 'mongoose';

const connectDB = async () => {
    const maxRetries = 5;
    let retries = 0;

    const connectWithRetry = async () => {
        try {
            if (!process.env.MONGODB_URI) {
                console.error('❌ MONGODB_URI is not defined in environment variables');
                return;
            }

            const options = {
                serverSelectionTimeoutMS: 10000, // 10 seconds
                socketTimeoutMS: 45000, // 45 seconds
                connectTimeoutMS: 10000, // 10 seconds
                retryWrites: true,
                w: 'majority',
            };

            const conn = await mongoose.connect(process.env.MONGODB_URI, options);
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
            retries = 0; // Reset retries on success
        } catch (error) {
            retries++;
            console.error(`❌ MongoDB connection error (Attempt ${retries}/${maxRetries}): ${error.message}`);
            
            if (retries < maxRetries) {
                console.log(`🔄 Retrying connection in 5 seconds...`);
                setTimeout(connectWithRetry, 5000);
            } else {
                console.error('❌ Failed to connect to MongoDB after multiple attempts');
                console.error('⚠️  Server will continue running, but database features will not work');
                console.error('💡 Please check:');
                console.error('   1. Your internet connection');
                console.error('   2. MongoDB Atlas cluster status');
                console.error('   3. MongoDB URI in .env file');
                console.error('   4. Firewall/network settings');
            }
        }
    };

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
        console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
        connectWithRetry();
    });

    mongoose.connection.on('error', (err) => {
        console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    await connectWithRetry();
};

export default connectDB;
