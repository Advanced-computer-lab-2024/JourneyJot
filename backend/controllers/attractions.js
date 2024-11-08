/** @format */

const Attraction = require('../models/Attraction');

// Create a new attraction
exports.createAttraction = async (req, res) => {
	try {
		console.log(req.body); // For debugging: log the request body

		// Create a new Attraction using the data in the request body
		const newAttraction = new Attraction({
			governorId: req.user ? req.user._id : req.body.governorId, // Fallback to req.body.governorId
			...req.body,
		});

		// Save the new attraction to the database
		await newAttraction.save();

		// Send a response with the new attraction details
		res.status(201).json({
			message: 'Attraction created successfully',
			attraction: newAttraction,
		});
	} catch (error) {
		// Error handling
		res.status(500).json({ message: 'Error creating attraction', error });
	}
};

// Get all attractions
exports.getAttractions = async (req, res) => {
	try {
		// Fetch all attractions and populate governorId for detailed information
		const attractions = await Attraction.find().populate('governorId');

		// Send a successful response with the list of attractions
		res.status(200).json(attractions);
	} catch (error) {
		// Error handling
		res.status(500).json({ message: 'Error fetching attractions', error });
	}
};

// Get a specific attraction by ID
exports.getAttraction = async (req, res) => {
	const { id } = req.params; // Extract the ID from the URL params
	try {
		// Fetch the specific attraction by ID and populate governorId
		const attraction = await Attraction.findById(id).populate(
			'governorId',
			'name email'
		);

		// Check if the attraction was found
		if (!attraction) {
			return res.status(404).json({ message: 'Attraction not found' });
		}

		// Send the attraction details
		res.status(200).json(attraction);
	} catch (error) {
		// Error handling
		res.status(500).json({ message: 'Error fetching attraction', error });
	}
};

// Update an attraction by ID
exports.updateAttraction = async (req, res) => {
	const { id } = req.params; // Extract ID from params for updating
	try {
		// Update the attraction with the new data from the request body
		const updatedAttraction = await Attraction.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		// Check if the attraction was found and updated
		if (!updatedAttraction) {
			return res.status(404).json({ message: 'Attraction not found' });
		}

		// Send the updated attraction details
		res.status(200).json({
			message: 'Attraction updated successfully',
			attraction: updatedAttraction,
		});
	} catch (error) {
		// Error handling
		res.status(500).json({ message: 'Error updating attraction', error });
	}
};

// Delete an attraction by ID
exports.deleteAttraction = async (req, res) => {
	const { id } = req.params; // Extract ID from URL params
	try {
		// Find and delete the attraction
		const deletedAttraction = await Attraction.findByIdAndDelete(id);

		// Check if the attraction was found and deleted
		if (!deletedAttraction) {
			return res.status(404).json({ message: 'Attraction not found' });
		}

		// Send a successful response
		res.status(200).json({ message: 'Attraction deleted successfully' });
	} catch (error) {
		// Error handling
		res.status(500).json({ message: 'Error deleting attraction', error });
	}
};

// Filter attractions based on provided tags
exports.filterAttractionsByTag = async (req, res) => {
	try {
		const { preferences } = req.query; // Get preferences from the query params
		let attractions = []; // Initialize an empty array for matching attractions

		if (preferences) {
			// Process the preferences to filter attractions by tags
			const tagNames = preferences
				.split(',') // Split by commas
				.map((tag) => tag.trim()) // Remove leading/trailing spaces
				.filter((tag) => tag); // Remove empty strings

			// Find attractions that contain any of the specified tags
			attractions = await Attraction.find({
				tags: { $in: tagNames }, // Use $in to check if tags are in the array
			});
		}

		// Send a response with the filtered attractions
		res.json({ count: attractions.length, data: attractions });
	} catch (error) {
		// Log and send error response
		console.error('Error filtering attractions:', error);
		res.status(500).send({ message: error.message });
	}
};
