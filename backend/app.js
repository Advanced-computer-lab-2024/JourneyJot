/** @format */

const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");

// Routers
const touristRouter = require("./routes/tourist");
const userRouter = require("./routes/user");
const tourGuideRouter = require("./routes/tour-guide");
const advertiserRouter = require("./routes/advertiser");  // Advertiser route
const sellerRouter = require("./routes/seller");
const adminRouter = require("./routes/admin");
const activityRoutes = require("./routes/activities");
const itineraryRouter = require("./routes/itineraries");
const attractionRouter = require("./routes/attraction");
const tagRouter = require("./routes/tags");
const preferenceTagRouter = require("./routes/preference-tag");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");
const TouristItineraryRouter = require("./routes/tourist-itinerary");
const cors = require("cors");
app.use(cors());
// Connect to mongoDB

// MongoDB connection
mongoose.connect(
  "mongodb+srv://gandoza:gandoza@mernapp.jly0k.mongodb.net/?retryWrites=true&w=majority&appName=MernApp",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Define routes
app.use("/tourists", touristRouter);
app.use("/users", userRouter);
app.use("/tour-guides", tourGuideRouter);
app.use("/advertisers", advertiserRouter);  // Advertiser routes for profile management
app.use("/sellers", sellerRouter);
app.use("/admins", adminRouter);
app.use("/activities", activityRoutes);
app.use("/itineraries", itineraryRouter);
app.use("/attractions", attractionRouter);
app.use("/tags", tagRouter);
app.use("/pref-tags", preferenceTagRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/tourist-itineraries", TouristItineraryRouter);

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
