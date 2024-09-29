const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();
const{createTourist,GetTouristInfo,updateTouristInfo} = require("./routes/TouristController");
const{createAdvertiser} = require("./routes/AdvertiserController");
const{createSeller} = require("./routes/SellerController");
const{createTourGuide} = require("./routes/TourGuideController");


const app = express();
app.use(express.json());
app.post("/addTourist",createTourist);
app.get("/TouristInfo",GetTouristInfo);
app.put('/updateTourist', updateTouristInfo);
app.post("/addAdvertiser",createAdvertiser);
app.post("/addSeller", createSeller);
app.post("/addTourGuide",createTourGuide);


const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    app.listen(PORT, () => {
      console.log(`Listening to requests on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
