const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const responseRoutes = require('./routes/responseRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ Error: MONGO_URI is missing in .env file');
    process.exit(1);
}

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

// API Routes
app.use('/api/auth', authRoutes);

app.use('/api/forms', formRoutes);
app.use('/api/forms', responseRoutes);   // responses will be under /api/forms/:formId/responses
app.use('/webhooks', webhookRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at https://form-builder-2-flc8.onrender.com/`);
});
