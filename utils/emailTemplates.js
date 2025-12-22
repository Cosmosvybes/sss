/**
 * ShareShed Premium Email Templates
 * Uses a responsive, card-based design with the brand's green color palette.
 */

const primaryColor = '#059669';
const secondaryColor = '#ecfdf5';
const textColor = '#1f2937';
const grayColor = '#6b7280';
const backgroundColor = '#f3f4f6';

const getBaseLayout = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${backgroundColor}; color: ${textColor}; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .header { background-color: ${primaryColor}; padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .footer { background-color: ${secondaryColor}; padding: 20px; text-align: center; font-size: 0.875rem; color: ${grayColor}; }
        .btn { display: inline-block; background-color: ${primaryColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2); }
        .btn:hover { background-color: #047857; }
        .info-grid { background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
        .info-item { margin-bottom: 5px; font-size: 0.95rem; }
        .info-label { font-weight: bold; color: ${grayColor}; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ShareShed</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ShareShed. All rights reserved.</p>
            <p>Connecting owners and renters securely.</p>
        </div>
    </div>
</body>
</html>
`;

const getWelcomeTemplate = (name) => {
    const content = `
        <h2 style="color: ${textColor}; margin-top: 0;">Welcome, ${name}! 🎉</h2>
        <p>We are absolutely thrilled to have you join the ShareShed community.</p>
        <p>Whether you're here to find the perfect gear for your next project or to earn extra income by sharing what you own, you're in the right place.</p>
        <p>Get started by exploring the thousands of items available near you.</p>
        <div style="text-align: center;">
            <a href="https://shareshed.com/dashboard" class="btn">Explore Marketplace</a>
        </div>
    `;
    return getBaseLayout(content);
};

const getBookingRequestTemplate = (ownerName, renterName, itemName, duration) => {
    const content = `
        <h2 style="margin-top: 0;">New Booking Request 🔔</h2>
        <p>Hi ${ownerName},</p>
        <p>Good news! <strong>${renterName}</strong>, a verified member of our community, wants to rent your item.</p>
        
        <div class="info-grid">
            <div class="info-item"><span class="info-label">Item:</span> ${itemName}</div>
            <div class="info-item"><span class="info-label">Renter:</span> ${renterName}</div>
            <div class="info-item"><span class="info-label">Duration:</span> ${duration}</div>
        </div>

        <p>Please review this request at your earliest convenience. Fast responses lead to higher ratings!</p>
        <div style="text-align: center;">
            <a href="https://shareshed.com/bookings" class="btn">Review Request</a>
        </div>
    `;
    return getBaseLayout(content);
};

const getBookingStatusTemplate = (renterName, itemName, status) => {
    const isApproved = status === 'Approved';
    const color = isApproved ? primaryColor : '#dc2626';
    const title = isApproved ? 'Booking Approved! ✅' : 'Booking Declined ❌';

    const content = `
        <h2 style="color: ${color}; margin-top: 0;">${title}</h2>
        <p>Hi ${renterName},</p>
        <p>Your request for <strong>${itemName}</strong> has been updated.</p>
        
        <div style="background-color: ${isApproved ? secondaryColor : '#fef2f2'}; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid ${isApproved ? '#d1fae5' : '#fee2e2'};">
            <strong>Status:</strong> <span style="color: ${color}; font-weight: bold;">${status}</span>
        </div>

        ${isApproved
            ? '<p>You\'re all set! Please proceed to the app to maximize your experience.</p>'
            : '<p>Don\'t worry, there are plenty of other similar items available on ShareShed.</p>'}
            
        <div style="text-align: center;">
            <a href="https://shareshed.com/bookings" class="btn" style="${!isApproved ? 'background-color: #374151;' : ''}">View Booking</a>
        </div>
    `;
    return getBaseLayout(content);
};

const getVerificationStatusTemplate = (userName, status) => {
    const isVerified = status === 'Verified';
    const color = isVerified ? primaryColor : '#dc2626';
    const title = isVerified ? 'You are Verified! 🌟' : 'Verification Update';

    const content = `
        <h2 style="color: ${color}; margin-top: 0;">${title}</h2>
        <p>Hi ${userName},</p>
        
        ${isVerified
            ? `<p>Congratulations! Your identity documents have been approved. You are now a fully verified member of ShareShed.</p>
               <p>This badge gives you access to premium listings and builds trust within the community.</p>`
            : `<p>We reviewed your documents, but unfortunately, we couldn't verify your identity at this time.</p>
               <p>Please ensure your photos are clear, not blurry, and match your profile details. You can try uploading them again via the app.</p>`
        }

        <div style="text-align: center;">
            <a href="https://shareshed.com/account" class="btn">Go to Account</a>
        </div>
    `;
    return getBaseLayout(content);
};

const getLoginAlertTemplate = (name, time, device) => {
    const content = `
        <h2 style="margin-top: 0; color: #DC2626;">New Login Alert ⚠️</h2>
        <p>Hi ${name},</p>
        <p>We detected a new login to your ShareShed account.</p>
        
        <div class="info-grid">
            <div class="info-item"><span class="info-label">Time:</span> ${time}</div>
            <div class="info-item"><span class="info-label">Device:</span> ${device || 'Unknown Device'}</div>
        </div>

        <p>If this was you, you can safely ignore this email.</p>
        <p><strong>If you did not authorize this login</strong>, please reset your password immediately to secure your account.</p>
        
        <div style="text-align: center;">
            <a href="https://shareshed.com/reset-password" class="btn" style="background-color: #DC2626;">Secure Account</a>
        </div>
    `;
    return getBaseLayout(content);
};

module.exports = {
    getWelcomeTemplate,
    getBookingRequestTemplate,
    getBookingStatusTemplate,
    getVerificationStatusTemplate,
    getLoginAlertTemplate
};
