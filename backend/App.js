/** @format */

const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require('dotenv').config();

const productRoutes = require('./routes/Products');
const advertiserRoutes = require('./routes/Advertisers');
const tourGuidesRoutes = require('./routes/TourGuide');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use('/products', productRoutes);
app.use('/advertisers', advertiserRoutes);
app.use('/tourGuides', tourGuidesRoutes);

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
