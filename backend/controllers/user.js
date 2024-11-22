/** @format */

const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming the User model is in the models folder
const jwt = require('jsonwebtoken');
exports.signUp = async (req, res) => {
	try {
		const { username, email, password, role, acceptedTerms } = req.body;

		// Check if terms and conditions are accepted
		if (!acceptedTerms) {
			return res.status(400).json({
				message: 'You must accept the terms and conditions to register',
			});
		}

		// Hash the password with bcrypt
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const idFile = req.files['idFile'] ? req.files['idFile'][0].filename : null;
		const additionalFiles = req.files['additionalFiles']
			? req.files['additionalFiles'].map((file) => file.filename)
			: [];

		// Create a new user with the hashed password and uploaded document paths
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			role,
			idFile,
			additionalFiles,
			acceptedTerms, // Set acceptedTerms
		});

		await newUser.save();
		return res
			.status(201)
			.json({ message: 'User registered successfully', user: newUser });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: 'Error during registration', error: error.message });
	}
};

exports.login = (req, res, next) => {
	User.findOne({ username: req.body.username })
		.exec()
		.then((user) => {
			if (!user) {
				return res
					.status(401)
					.json({ message: 'Auth failed: username does not exist' });
			}

			// Check if the user is accepted by the admin
			if (
				['tour_guide', 'advertiser', 'seller'].includes(user.role) &&
				user.registrationStatus !== 'approved'
			) {
				return res
					.status(403)
					.json({ message: 'Account has been rejected or not approved yet' });
			}

			// Compare password
			bcrypt.compare(req.body.password, user.password, (err, result) => {
				if (err) {
					return res.status(401).json({ message: 'Auth failed' });
				} else if (result) {
					// Sign JWT if authentication is successful
					jwt.sign(
						{
							username: user.username,
							_id: user._id,
							role: user.role,
							email: user.email,
						},
						'cr7', // JWT secret key (consider using environment variable)
						{
							expiresIn: '12h',
						},
						(errors, token) => {
							if (errors) {
								return res.status(500).json({ error: errors.message });
							}

							return res.status(200).json({
								message: 'Authentication successful',
								token: token,
								role: user.role,
							});
						}
					);
				} else {
					return res
						.status(401)
						.json({ message: 'Auth failed: incorrect password' });
				}
			});
		})
		.catch((error) => {
			console.error('Error finding user:', error);
			return res
				.status(500)
				.json({ message: 'Authentication failed', error: error.message });
		});
};
