const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');

// Placeholder for now - will integrate Resend later
router.post('/send-transactional', verifyToken, async (req, res) => {
    // Logic to call Resend API would go here
    res.json({ success: true, message: 'Email queued (Mock)' });
});

module.exports = router;
