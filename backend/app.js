/** @format */

const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const touristRouter = require('./routes/tourist');
const userRouter = require('./routes/user');
const tourGuideRouter = require('./routes/tour-guide');
const advertiserRouter = require('./routes/advertiser');
const sellerRouter = require('./routes/seller');
const adminRouter = require('./routes/admin');
const activityRoutes = require('./routes/activities');
const itineraryRouter = require('./routes/itineraries');
const attractionRouter = require('./routes/attraction');
const tagRouter = require('./routes/tags');
const preferenceTagRouter = require('./routes/preference-tag');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');
const initialAdmin = require('./controllers/admin');
const uploadRouter = require('./routes/upload');
const complaintRouter = require('./routes/Complaints');
const reviewRouter = require('./routes/reviews');
const cors = require('cors');
app.use(
	cors({
		origin: 'http://localhost:5173', // Your frontend's origin
		credentials: true,
	})
);

mongoose.connect(
	'mongodb+srv://gando27:gando27@mernapp.jly0k.mongodb.net/?retryWrites=true&w=majority&appName=MernApp'
);
console.log('MongoDB connected');
initialAdmin.initialAdmin();

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/photos', express.static(path.join(__dirname, 'photos')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/tourists', touristRouter);
app.use('/users', userRouter);
app.use('/tour-guides', tourGuideRouter);
app.use('/advertisers', advertiserRouter);
app.use('/sellers', sellerRouter);
app.use('/admins', adminRouter);
app.use('/activities', activityRoutes);
app.use('/itineraries', itineraryRouter);
app.use('/attractions', attractionRouter);
app.use('/tags', tagRouter);
app.use('/pref-tags', preferenceTagRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/upload', uploadRouter);
app.use('/complaints', complaintRouter);
app.use('/reviews', reviewRouter);

module.exports = app;
