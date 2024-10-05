const express = require("express");
const mongoose = require("mongoose");
const historicalPlacesRouter = require("./routes/HistoricalPlaces");
const museumsRouter = require("./routes/Museums");
const tagsRouter = require("./routes/Tag");
const bodyParser = require("body-parser");
const TourGuideRoute = require("./routes/TourGuideRoute");
const AdvertiserRoute = require("./routes/AdvertiserRoute");
const ItineraryRoutes = require("./routes/ItineraryRoute");
const productRoutes = require("./routes/Products");
const activityRoutes = require("./routes/Activity");
const itineraryRoutes = require("./routes/Itinerary");
const adminRoutes = require("./routes/adminRoutes");
const touristRoutes = require("./routes/touristRoutes");
const cors = require("cors");

require("dotenv").config();
const {
  searchProductByName,
  getAllProducts,
  filterProductsByPrice,
} = require("./routes/Products");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/products", productRoutes);
app.use("/activity", activityRoutes);
app.use("/itinerary", itineraryRoutes);
app.use("/admin", adminRoutes);
app.use("/tourists", touristRoutes);
app.use("/TourGuide", TourGuideRoute);
app.use("/advertisers", AdvertiserRoute);
app.use("/historical-places", historicalPlacesRouter);
app.use("/museums", museumsRouter);
app.use("/api", tagsRouter);

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Set up your routes

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB is connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  });
