const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const admin = require("firebase-admin");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Security & Middleware ---
app.use(helmet()); // Adds security headers
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// --- Firebase Initialization ---
// We use environment variables for credentials to allow deployment on Render without a file
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (error) {
        console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:', error);
        process.exit(1);
    }
} else {
    try {
        serviceAccount = require('./service-account.json'); // Fallback for local dev
    } catch (error) {
        console.error('❌ FATAL ERROR: No Firebase credentials found.');
        console.error('   - On Render: Set FIREBASE_SERVICE_ACCOUNT environment variable.');
        console.error('   - Locally: Ensure service-account.json exists.');
        process.exit(1);
    }
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

// --- Routes ---
const paymentRoutes = require('./routes/payment.routes');
const emailRoutes = require('./routes/email.routes');

app.use('/api/payments', paymentRoutes);
app.use('/api/email', emailRoutes);

app.get('/', (req, res) => {
    res.send('ShareShed Secure Backend is Running!');
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
