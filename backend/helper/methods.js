/** @format */

// helper.js
exports.calculateAge = (dob) => {
	const today = new Date();
	const birthDate = new Date(dob);
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();

	// Check if the birth month hasn't been reached yet, or if it's the birth month but the birth day hasn't happened yet
	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birthDate.getDate())
	) {
		age--; // Subtract 1 year from age if not reached the birthday in the current year
	}

	return age;
};
