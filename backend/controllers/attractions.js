/** @format */

// controllers/attractionController.js

const Attraction = require('../models/Attraction');
const Tag = require('../models/Tag'); // Import Tag model

exports.createAttraction = async (req, res) => {
	try {
		console.log(req.body);
		const newAttraction = new Attraction(req.body);
		await newAttraction.save();
		res.status(201).json({
			message: 'Attraction created successfully',
			attraction: newAttraction,
		});
	} catch (error) {
		res.status(500).json({ message: 'Error creating attraction', error });
	}
};

exports.getAttractions = async (req, res) => {
	try {
		const attractions = await Attraction.find().populate('tags'); // Populate tags
		res.status(200).json(attractions);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching attractions', error });
	}
};
exports.getAttraction = async (req, res) => {
	const { id } = req.params;
	try {
		const attractions = await Attraction.findById(id).populate('tags'); // Populate tags
		res.status(200).json(attractions);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching attractions', error });
	}
};

exports.updateAttraction = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedAttraction = await Attraction.findByIdAndUpdate(id, req.body, {
			new: true,
		}).populate('tags'); // Populate tags
		if (!updatedAttraction)
			return res.status(404).json({ message: 'Attraction not found' });
		res.status(200).json({
			message: 'Attraction updated successfully',
			attraction: updatedAttraction,
		});
	} catch (error) {
		res.status(500).json({ message: 'Error updating attraction', error });
	}
};

exports.deleteAttraction = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedAttraction = await Attraction.findByIdAndDelete(id);
		if (!deletedAttraction)
			return res.status(404).json({ message: 'Attraction not found' });
		res.status(200).json({ message: 'Attraction deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting attraction', error });
	}
};

exports.filterAttractionsByTag = async (req, res) => {
	try {
		const { preferences } = req.query;
		let attractions = []; // Initialize attractions

		// Check if preferences exist and are not empty
		if (preferences) {
			const tagNames = preferences
				.split(',')
				.map((tag) => tag.trim())
				.filter((tag) => tag); // Split, trim, and filter out empty values

			// Find tags by names
			const tags = await Tag.find({ name: { $in: tagNames } });
			const tagIds = tags.map((tag) => tag._id); // Get ObjectIds of the found tags

			if (tagIds.length > 0) {
				attractions = await Attraction.find({ tags: { $in: tagIds } }); // Use $in for matching any tag
			}
		}

		res.json({ count: attractions.length, data: attractions });
	} catch (error) {
		console.error('Error filtering attractions:', error); // Log error for debugging
		res.status(500).send({ message: error.message });
	}
};
