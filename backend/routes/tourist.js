/** @format */

const { Router } = require("express");
const {
  signUp,
  login,
  getTouristProfile,
  updateTouristProfile,
  getTouristID,
  buyProduct,
  getTouristProductHistory,
  TouristReviewProduct,
} = require("../controllers/tourist");
const auth_check = require("../middleware/auth-check");
const { changePassword } = require("../helper/tourist-change-password");

const touristRouter = Router();

touristRouter.post("/signup", signUp);
touristRouter.post("/login", login);
touristRouter.get("/profile", auth_check, getTouristProfile);
touristRouter.put("/profile", auth_check, updateTouristProfile);
touristRouter.post("/changePassword", auth_check, changePassword);
touristRouter.get("/getTouristID", auth_check, getTouristID);
touristRouter.post("/buyProduct", auth_check, buyProduct);
touristRouter.get("/productHistory", auth_check, getTouristProductHistory);
touristRouter.post("/review", auth_check, TouristReviewProduct);

module.exports = touristRouter;
