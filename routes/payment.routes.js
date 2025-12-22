const express = require('express');
const router = express.Router();
const axios = require('axios');
const admin = require("firebase-admin");
const verifyToken = require('../middleware/auth.middleware');

const db = admin.firestore();

// Securely access Paystack Key from Environment Variable
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

// GET /api/payments/banks
// Fetch list of banks from Paystack
router.get('/banks', async (req, res) => {
    try {
        const response = await axios.get("https://api.paystack.co/bank", {
            headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Fetch Banks Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch banks" });
    }
});

// GET /api/payments/resolve-account
// Verify account number
router.get('/resolve-account', verifyToken, async (req, res) => {
    const { account_number, bank_code } = req.query;

    if (!account_number || !bank_code) {
        return res.status(400).json({ success: false, message: "Missing account details" });
    }

    try {
        const response = await axios.get(`https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`, {
            headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Resolve Account Error:", error.response?.data || error.message);
        res.status(400).json({
            success: false,
            message: "Could not verify account",
            details: error.response?.data?.message
        });
    }
});

// POST /api/payments/create-recipient
// Create a Paystack Transfer Recipient
router.post('/create-recipient', verifyToken, async (req, res) => {
    const { name, account_number, bank_code } = req.body;

    if (!name || !account_number || !bank_code) {
        return res.status(400).json({ success: false, message: "Missing recipient details" });
    }

    try {
        const response = await axios.post("https://api.paystack.co/transferrecipient", {
            type: "nuban",
            name,
            account_number,
            bank_code,
            currency: "NGN"
        }, {
            headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
        });

        res.json({ success: true, data: response.data.data });
    } catch (error) {
        console.error("Create Recipient Error:", error.response?.data || error.message);
        res.status(400).json({
            success: false,
            message: "Failed to create recipient",
            details: error.response?.data?.message
        });
    }
});

// POST /api/payments/transfer
// Secure transfer endpoint protected by Firebase Auth
router.post('/transfer', verifyToken, async (req, res) => {
    const { amount, recipientCode, reason } = req.body;
    const userId = req.user.uid;

    if (!amount || !recipientCode) {
        return res.status(400).json({ success: false, message: 'Missing amount or recipient' });
    }

    if (!PAYSTACK_SECRET) {
        console.error("CRITICAL: Paystack Secret Key not found in Environment Variables.");
        return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    try {
        console.log(`Processing transfer of ₦${amount} for user ${userId}...`);

        // 1. (Optional) Check user Balance in Firestore before sending money
        // const userRef = db.collection('users').doc(userId);
        // ... balance check logic here ...

        // 2. Make Secure API Call to Paystack
        const response = await axios.post("https://api.paystack.co/transfer", {
            source: "balance",
            amount: amount * 100, // Convert to Kobo
            recipient: recipientCode,
            reason: reason || "ShareShed Payout"
        }, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET}`,
                'Content-Type': 'application/json'
            }
        });

        const result = response.data;
        if (result.status) {
            // 3. Log Audit Trail
            await db.collection('transactions').add({
                type: 'payout',
                userId: userId,
                amount: amount,
                transferCode: result.data.transfer_code,
                status: 'pending', // Paystack processes async
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });

            return res.json({ success: true, transferCode: result.data.transfer_code });
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }

    } catch (error) {
        console.error("Payout Error:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: 'Payment provider rejected the request',
            details: error.response?.data?.message || error.message
        });
    }
});

module.exports = router;
