const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter object
const isGmail = process.env.SMTP_SERVICE === 'gmail' || process.env.SMTP_HOST === 'gmail';
const host = isGmail ? 'smtp.gmail.com' : (process.env.SMTP_HOST || 'smtp.gmail.com');

// Default to 587 (STARTTLS) which is less likely to be blocked than 465
const port = parseInt(process.env.SMTP_PORT || '587');
const secure = port === 465; // true for 465, false for 587 (uses STARTTLS)

// Use 'service: gmail' which automatically sets host, port (587/465), and secure settings correctly.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '', // Remove spaces if present
    },
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log("❌ SMTP Connection Error:", error);
    } else {
        console.log(`✅ Server is ready to take our messages (Host: ${host}, Port: ${port}, Secure: ${secure})`);
    }
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content (rendered from React Email)
 */
const sendEmail = async (to, subject, html) => {
    console.log(`📧 Preparing to send email to ${to} via ${host}:${port}...`);
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"ShareShed" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log("✅ Message sent successfully! Message ID: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("❌ Error sending email:", error);
        // Log more details if available
        if (error.response) console.error("SMTP Response:", error.response);
        return { success: false, error };
    }
};

module.exports = { sendEmail };
