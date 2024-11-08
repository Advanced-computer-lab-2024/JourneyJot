/** @format */

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res
			.status(401)
			.json({ message: 'Token is required or incorrect format' });
	}

	const token = authHeader.split(' ')[1];
	console.log(token);
	console.log(req.user);
	jwt.verify(token, 'cr7', (err, user) => {
		if (err) return res.status(403).json({ message: 'Invalid token' });
		console.log(user);

		req.user = user; // user should contain _id and other details
		next();
	});
};
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('completedItineraries');
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
