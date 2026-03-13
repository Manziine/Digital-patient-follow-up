require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set. Please configure it in your environment variables.');
    process.exit(1);
}

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        const dbType = MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'MongoDB Local';
        console.log(`✅ Connected to ${dbType}`);
        const server = app.listen(PORT, () => {
            console.log(`🚀 DPFCSS API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received, closing server...');
            server.close(() => mongoose.connection.close());
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    });
