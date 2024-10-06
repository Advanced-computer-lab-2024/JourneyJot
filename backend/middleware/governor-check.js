/** @format */

module.exports = (req, res, next) => {
	if (req.user.role !== 'governor') {
		return res
			.status(403)
			.json({ message: 'Access denied. Governors only.' });
	}
	next();
};
