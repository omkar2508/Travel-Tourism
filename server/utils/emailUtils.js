// D:/server/utils/emailUtils.js
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' }); // Adjust path

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendBookingConfirmationEmail = async (toEmail, userName, placeId) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Booking Confirmation - Travel & Tourism System',
        text: `Hello ${userName},\n\nYour booking for place ID ${placeId} is confirmed.\n\nThank you for choosing us!`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Booking confirmation email sent to ${toEmail}`);
        return true;
    } catch (error) {
        console.error(`Error sending booking confirmation email to ${toEmail}:`, error);
        return false;
    }
};

module.exports = { sendBookingConfirmationEmail };