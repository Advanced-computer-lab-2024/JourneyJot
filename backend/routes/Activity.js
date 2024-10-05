/** @format */

const express = require('express');
const Activity = require('../models/Activity');
const router = express.Router();

router.post('/', async (req, res) => {
	try {
		console.log(req.body);
		if (
			!req.body.title ||
			!req.body.date ||
			!req.body.time ||
			!req.body.location ||
			!req.body.price ||
			!req.body.category ||
			!req.body.tags ||
			!req.body.specialDiscounts ||
			!req.body.bookingOpen
		) {
			return res.status(400).send({ message: 'Send All Required Fields' });
		}
		const newActivity = {
			title: req.body.title,
			date: req.body.date,
			time: req.body.time,
			location: req.body.location,
			price: req.body.price,
			category: req.body.category,
			tags: req.body.tags,
			specialDiscounts: req.body.specialDiscounts,
			bookingOpen: req.body.bookingOpen,
		};
		const activity = await Activity.create(newActivity);
		return res.status(200).send(activity);
	} catch (error) {
		console.log(error.message);
		res.status(400).json({ error: error.message });
	}
});

router.get('/', async (req, res) => {
	try {
		const activity = await Activity.find({});
		return res.status(200).json({ count: activity.length, data: activity });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const activity = await Activity.findById(req.params.id);
		if (!activity) {
			return res.status(404).json({ message: 'Activity not found' });
		}
		res.status(200).json(activity);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.put('/:id', async (req, res) => {
	try {
		if (
			!req.body.title ||
			!req.body.date ||
			!req.body.time ||
			!req.body.location ||
			!req.body.price ||
			!req.body.category ||
			!req.body.tags ||
			!req.body.specialDiscounts ||
			!req.body.bookingOpen
		) {
			return res.status(400).send({ message: 'Send All Required Fields' });
		}
		const updatedActivity = await Activity.findByIdAndUpdate(
			req.params.id,
			req.body
		);
		if (!updatedActivity) {
			return res.status(400).send({ message: 'Activity not Updated' });
		}
		return res.status(200).send({ message: 'Activity Updated' });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
		if (!deletedActivity) {
			return res.status(400).send({ message: 'Activity not Deleted' });
		}
		return res.status(200).send({ message: 'Activity Deleted' });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});
module.exports = router;
