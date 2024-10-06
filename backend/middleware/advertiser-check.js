/** @format */

module.exports = (req, res, next) => {
	if (req.user.role !== 'advertiser') {
		return res
			.status(403)
			.json({ message: 'Access denied. Advertisers only.' });
	}
	next();
};
