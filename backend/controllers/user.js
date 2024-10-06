/** @format */

const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming the User model is in the models folder
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res, next) => {
	const { username, email, password, role } = req.body;
	try {
		// Check if the user already exists with the given email
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({
				message: 'User already exists with the given username',
			});
		}
		if (!['tour_guide', 'advertiser', 'seller', 'admin'].includes(role)) {
			return res.status(400).json({ message: 'Invalid role type' });
		}
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new user
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			role,
		});

		await newUser.save();
		res
			.status(201)
			.json({ message: 'User registered successfully', user: newUser });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
exports.login = (req, res, next) => {
	User.find({ username: req.body.username })
		.exec()
		.then((user) => {
			if (user.length < 1) {
				return res
					.status(401)
					.json({ message: 'Auth failed username does not exist' });
			}
			bcrypt.compare(req.body.password, user[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({ message: 'Auth failed' });
				} else if (result) {
					jwt.sign(
						{
							username: user[0].username,
							_id: user[0]._id,
							role: user[0].role,
						},
						'cr7',
						{
							expiresIn: '12h',
						},
						(errors, results) => {
							if (errors) {
								return res.status(500).json({ error: errors.message });
							}
							return res.status(200).json({
								message: 'Authentication successful',
								token: results,
							});
						}
					);
				} else {
					return res
						.status(401)
						.json({ message: 'Auth failed incorrect password' });
				}
			});
		})
		.catch((error) => {
			console.log('Error finding user:', error);
			return res.status(401).json({ message: 'Authentication failed' });
		});
};
