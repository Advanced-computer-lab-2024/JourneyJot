/** @format */

const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const touristRouter = require("./routes/tourist");
const userRouter = require("./routes/user");
const tourGuideRouter = require("./routes/tour-guide");
const advertiserRouter = require("./routes/advertiser");
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

// Other imports...
const cors = require("cors");
app.use(cors());
// Connect to mongoDB

mongoose.connect(
  "mongodb+srv://gandoza:gandoza@mernapp.jly0k.mongodb.net/?retryWrites=true&w=majority&appName=MernApp"
);
console.log("MongoDB connected");
app.use("/tourists", touristRouter);
app.use("/users", userRouter);
app.use("/tour-guides", tourGuideRouter);
app.use("/advertisers", advertiserRouter);
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
module.exports = app;
