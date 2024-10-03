/** @format */

const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require('dotenv').config();

const productRoutes = require('./routes/Products');
const activityRoutes = require('./routes/Activity');
const itineraryRoutes = require('./routes/Itinerary');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use('/products', productRoutes);
app.use('/activity', activityRoutes);
app.use('/itinerary', itineraryRoutes);

mongoose
	.connect(MONGO_URI)
	.then(() => {
		console.log('MongoDB is now connected!');
		// Starting server
		app.listen(PORT, () => {
			console.log(`Listening to requests on http://localhost:${PORT}`);
		});
	})
	.catch((err) => console.log(err));
