/** @format */

const User = require('../models/User');

exports.acceptTerms = (req, res, next) => {
	const userId = req.user._id; // Assuming user ID is included in the token payload

	User.findByIdAndUpdate(userId, { termsAccepted: true })
		.then(() =>
			res.status(200).json({ message: 'Terms and conditions accepted' })
		)
		.catch((error) =>
			res
				.status(500)
				.json({ message: 'Failed to accept terms', error: error.message })
		);
};
