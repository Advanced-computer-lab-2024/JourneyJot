/** @format */

module.exports = (req, res, next) => {
	if (
		req.user.role !== 'governor' ||
		req.user.role !== 'tour_guide' ||
		req.user.role !== 'advertiser'
	) {
		return res.status(403).json({
			message: 'Access denied. Governors,tour_guide,advertiser  only.',
		});
	}
	next();
};
