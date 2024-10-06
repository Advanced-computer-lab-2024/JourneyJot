/** @format */

// controllers/category.js

const Category = require('../models/Category'); // Assuming you have a Category model

// Create a new category
exports.createCategory = async (req, res) => {
	try {
		const category = new Category({ ...req.body });
		await category.save();
		res
			.status(201)
			.json({ message: 'Category created successfully', category });
	} catch (error) {
		res.status(400).json({ message: 'Error creating category', error });
	}
};

// Get all categories
exports.getCategories = async (req, res) => {
	try {
		const categories = await Category.find({});
		res.status(200).json(categories);
	} catch (error) {
		res.status(400).json({ message: 'Error retrieving categories', error });
	}
};

// Update a category
exports.updateCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		res
			.status(200)
			.json({ message: 'Category updated successfully', updatedCategory });
	} catch (error) {
		res.status(400).json({ message: 'Error updating category', error });
	}
};

// Delete a category
exports.deleteCategory = async (req, res) => {
	try {
		const { id } = req.params;
		await Category.findByIdAndDelete(id);
		res.status(200).json({ message: 'Category deleted successfully' });
	} catch (error) {
		res.status(400).json({ message: 'Error deleting category', error });
	}
};
