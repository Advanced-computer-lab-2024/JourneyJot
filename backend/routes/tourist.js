/** @format */

const { Router } = require("express");
const {
  signUp,
  login,
  getTouristProfile,
  updateTouristProfile,
} = require("../controllers/tourist");
const auth_check = require("../middleware/auth-check");
const touristRouter = Router();

touristRouter.post("/signup", signUp);
touristRouter.post("/login", login);
touristRouter.get("/profile", getTouristProfile);
touristRouter.put("/profile", auth_check, updateTouristProfile);

module.exports = touristRouter;
