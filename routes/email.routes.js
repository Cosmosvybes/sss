const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const { sendEmail } = require('../utils/email');
const {
    getWelcomeTemplate,
    getBookingRequestTemplate,
    getBookingStatusTemplate,
    getVerificationStatusTemplate,
    getLoginAlertTemplate
} = require('../utils/emailTemplates');

router.post('/send-transactional', verifyToken, async (req, res) => {
    try {
        const { type, data, to } = req.body;

        if (!to) {
            return res.status(400).json({ success: false, message: 'Recipient email required' });
        }

        let subject = '';
        let html = '';

        switch (type) {
            case 'welcome':
                subject = 'Welcome to ShareShed!';
                html = getWelcomeTemplate(data.name || 'User');
                break;
            case 'booking_request':
                subject = `New Booking Request: ${data.itemName}`;
                html = getBookingRequestTemplate(data.ownerName, data.renterName, data.itemName, data.duration);
                break;
            case 'booking_status':
                subject = `Booking Update: ${data.itemName}`;
                html = getBookingStatusTemplate(data.renterName, data.itemName, data.status);
                break;
            case 'verification_status':
                subject = `Experience Verification Update`;
                html = getVerificationStatusTemplate(data.userName, data.status);
                break;
            case 'login_alert':
                console.log(`🔐 Login Alert Triggered for: ${to} on ${data.device} at ${data.time}`);
                subject = 'Security Alert: New Login Detected';
                html = getLoginAlertTemplate(data.name || 'User', data.time, data.device);
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid email type' });
        }

        const result = await sendEmail(to, subject, html);

        if (result.success) {
            res.json({ success: true, message: 'Email sent successfully', id: result.messageId });
        } else {
            res.status(500).json({ success: false, message: 'Failed to send email', error: result.error });
        }

    } catch (error) {
        console.error("Email Route Error:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
