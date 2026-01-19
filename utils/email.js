
require('dotenv').config();
const { Resend } = require('resend');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Resend with the provided API Key
// NOTE: For production, move this to process.env.RESEND_API_KEY
const resend = new Resend('re_6s5kzyXZ_DPx38oU3Mtt7omkKSoy6jVAp');

const sendEmail = async (to, subject, html) => {
    try {
        console.log(`🚀 Sending email to ${to} via Resend...`);

        // NOTE: 'onboarding@resend.dev' is the ONLY allowed sender for the free tier 
        // until you verify your own domain on resend.com.
        const { data, error } = await resend.emails.send({
            from: 'ShareShed <shareshed@support.com>',
            to: [to],
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('❌ Resend API Error:', error);
            return { success: false, error: error };
        }

        console.log('✅ Email sent successfully:', data);
        return { success: true, messageId: data.id };

    } catch (error) {
        console.error('❌ Unexpected Email Error:', error);
        return { success: false, error: error };
    }
};

module.exports = { sendEmail };
