/** @format */

module.exports = (req, res, next) => {
	if (req.user.role !== 'tour_guide') {
		return res.status(403).json({ message: 'Access denied. TourGuides only.' });
	}
	next();
};
