/** @format */

// controllers/tagController.js

const Tag = require('../models/Tag');
exports.createTag = async (req, res) => {
	try {
		const newTag = new Tag(req.body);
		await newTag.save();
		res.status(201).json({ message: 'Tag created successfully', tag: newTag });
	} catch (error) {
		res.status(500).json({ message: 'Error creating tag', error });
	}
};

exports.getTags = async (req, res) => {
	try {
		const tags = await Tag.find();
		res.status(200).json(tags);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching tags', error });
	}
};
