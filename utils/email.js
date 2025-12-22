const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter object
const isGmail = process.env.SMTP_SERVICE === 'gmail' || process.env.SMTP_HOST === 'gmail';
const host = isGmail ? 'smtp.gmail.com' : (process.env.SMTP_HOST || 'smtp.gmail.com');

// Default to 587 (STARTTLS) which is less likely to be blocked than 465
const port = parseInt(process.env.SMTP_PORT || '587');
const secure = port === 465; // true for 465, false for 587 (uses STARTTLS)

const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: secure,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log("❌ SMTP Connection Error:", error);
    } else {
        console.log("✅ Server is ready to take our messages");
    }
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content (rendered from React Email)
 */
const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"ShareShed" <no-reply@shareshed.com>',
            to,
            subject,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
};

module.exports = { sendEmail };
