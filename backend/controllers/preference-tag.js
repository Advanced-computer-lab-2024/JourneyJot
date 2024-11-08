/** @format */

const PreferenceTag = require('../models/preferenceTag');
exports.createPreferenceTag = async (req, res) => {
	try {
		const { name } = req.body;

		// Check if tag already exists
		const existingTag = await PreferenceTag.findOne({ name });
		if (existingTag) {
			return res.status(400).json({ message: 'Tag already exists' });
		}

		const tag = new PreferenceTag({ name });
		await tag.save();
		res
			.status(201)
			.json({ message: 'Preference tag created successfully', tag });
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error creating tag', error: error.message });
	}
};
exports.getAllPreferenceTags = async (req, res) => {
	try {
		const tags = await PreferenceTag.find();
		res.status(200).json(tags);
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error fetching tags', error: error.message });
	}
};
exports.updatePreferenceTag = async (req, res) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		const tag = await PreferenceTag.findByIdAndUpdate(
			id,
			{ name },
			{ new: true }
		);

		if (!tag) {
			return res.status(404).json({ message: 'Tag not found' });
		}

		res.status(200).json({ message: 'Tag updated successfully', tag });
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error updating tag', error: error.message });
	}
};
exports.deletePreferenceTag = async (req, res) => {
	try {
		const { id } = req.params;

		const tag = await PreferenceTag.findByIdAndDelete(id);

		if (!tag) {
			return res.status(404).json({ message: 'Tag not found' });
		}

		res.status(200).json({ message: 'Tag deleted successfully' });
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error deleting tag', error: error.message });
	}
};
