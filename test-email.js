require('dotenv').config();
const { sendEmail } = require('./utils/email');
const { getWelcomeTemplate } = require('./utils/emailTemplates');

const testSending = async () => {
    console.log("Testing premium email templates...");

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
