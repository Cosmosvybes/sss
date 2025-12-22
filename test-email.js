require('dotenv').config();
const { sendEmail } = require('./utils/email');
const { getWelcomeTemplate } = require('./utils/emailTemplates');

const testSending = async () => {
    console.log("Testing premium email templates...");

    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
        console.error("\n❌ CRITICAL CONFIG ERROR: Missing Email Credentials");
        console.error("---------------------------------------------------");
        console.error("You must set SMTP_USER and SMTP_PASS in server/.env");
        console.error("Current SMTP_USER:", user ? user : "(Missing)");
        console.error("Current SMTP_PASS:", pass ? "********" : "(Missing)");
        return;
    }

    // Target email provided by user
    const recipient = 'alfredchrisayo@gmail.com';
    const name = 'Alfred';

    console.log(`Sending Welcome Email to ${recipient}...`);

    // Generate HTML using the new premium template
    const html = getWelcomeTemplate(name);

    const result = await sendEmail(
        recipient,
        "Welcome to ShareShed - Premium Design Test",
        html
    );

    if (result.success) {
        console.log("✅ Email sent successfully!");
        console.log("Message ID:", result.messageId);
    } else {
        console.error("❌ Failed to send email.");
        console.error(result.error);
    }
};

testSending();
