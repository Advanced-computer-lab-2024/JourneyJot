/** @format */

const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require('dotenv').config();

// Import routes
const productRoutes = require('./routes/Products');
const advertiserRoutes = require('./routes/Advertisers');
const tourGuidesRoutes = require('./routes/tourGuide');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.get('/', (req, res) => {
	res.send('Welcome to the API!');
});

// Use imported routes
app.use('/products', productRoutes);
app.use('/advertisers', advertiserRoutes);
app.use('/tourGuides', tourGuidesRoutes);
app.use('/Admin', adminRoutes);

// Connect to MongoDB and start the server
mongoose
	.connect(MONGO_URI)
	.then(() => {
		console.log('MongoDB is now connected!');
		app.listen(PORT, () => {
			console.log(`Listening to requests on http://localhost:${PORT}`);
		});
	})
	.catch((err) => console.log(err));
