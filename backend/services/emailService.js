/** @format */

const nodemailer = require('nodemailer');

// Create transporter (configure with your email and password or SMTP server)
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.USER_EMAIL,
		pass: process.env.USER_PASS,
	},
});

// Function to send out-of-stock email
// Inside emailService.js
exports.sendOutOfStockEmail = async (adminEmail, product) => {
	const mailOptions = {
		from: process.env.EMAIL_USER, // Sender address
		to: adminEmail, // Admin email passed as an argument
		subject: `Product Out of Stock: ${product.name}`,
		html: `
        <h1>Product Out of Stock Notification</h1>
        <p>The product <strong>${product.name}</strong> is now out of stock.</p>
        <p>Please restock it as soon as possible to avoid disruptions.</p>
      `,
	};

	try {
		// Send the email
		await transporter.sendMail(mailOptions);
		console.log(`Out-of-stock email sent to ${adminEmail}`);
	} catch (error) {
		console.error('Error sending out-of-stock email:', error);
	}
};
