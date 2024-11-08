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
