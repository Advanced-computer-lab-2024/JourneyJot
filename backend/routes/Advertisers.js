/** @format */

const express = require('express');
const router = express.Router();
const Advertiser = require('../models/Advertiser.js');

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
		const newAdvertiser = {
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
		const advertiser = await Advertiser.create(newAdvertiser);
		return res.status(200).send(advertiser);
	} catch (error) {
		console.log(error.message);
		res.status(400).json({ error: error.message });
	}
});

router.get('/', async (req, res) => {
	try {
		const advertisers = await Advertiser.find({});
		return res
			.status(200)
			.json({ count: advertisers.length, data: advertisers });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const advertiser = await Advertiser.findById(req.params.id);
		if (!advertiser) {
			return res.status(404).json({ message: 'Advertiser not found' });
		}
		res.status(200).json(advertiser);
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
		const updatedAdvertiser = await Advertiser.findByIdAndUpdate(
			req.params.id,
			req.body
		);
		if (!updatedAdvertiser) {
			return res.status(400).send({ message: 'advertiser not found' });
		}
		return res.status(200).send({ message: 'advertiser found' });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const deletedAdvertiser = await Advertiser.findByIdAndDelete(req.params.id);
		if (!deletedAdvertiser) {
			return res.status(400).send({ message: 'advertiser not found' });
		}
		return res.status(200).send({ message: 'advertiser found' });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});
module.exports = router;
