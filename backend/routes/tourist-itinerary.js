const express = require("express");
const itineraryRouter = express.Router();
const {
  addItinerary,
  getItineraries,
  updatedItinerary,
  deleteItinerary,
} = require("../controllers/tourist-itinerary");

itineraryRouter.post("/", addItinerary);
itineraryRouter.get("/", getItineraries);
itineraryRouter.put("/:id", updatedItinerary);
itineraryRouter.delete("/:id", deleteItinerary);

module.exports = itineraryRouter;
