router.get('/', async (req, res) => {
	try {
		// Prepare a query object
		const query = {};

		// Check for the "budget" query parameter and add to query if it exists
		if (req.query.budget) {
			query.price = { $lte: req.query.budget }; // Finds activities less than or equal to the budget
		}

		// Check for the "date" query parameter and add to query if it exists
		if (req.query.date) {
			query.date = { $gte: new Date(req.query.date) }; // Finds activities on or after the specified date
		}

		// Check for the "category" query parameter and add to query if it exists
		if (req.query.category) {
			query.category = req.query.category; // Matches the exact category
		}

		// Check for the "ratings" query parameter and add to query if it exists
		if (req.query.ratings) {
			query.ratings = { $gte: req.query.ratings }; // Finds activities with ratings greater than or equal to the specified rating
		}

		// Set the sorting criteria based on the query parameter
		let sortBy = {};
		if (req.query.sort === 'price') {
			sortBy.price = 1; // Sort by price in ascending order
		} else if (req.query.sort === 'ratings') {
			sortBy.ratings = -1; // Sort by ratings in descending order
		}

		// Fetch activities based on the constructed query and sorting
		const activities = await Activity.find(query).sort(sortBy);

		// Send the response
		return res.status(200).json({ count: activities.length, data: activities });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});

