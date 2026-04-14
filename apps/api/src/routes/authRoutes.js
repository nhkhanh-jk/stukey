const express = require("express");
const routes = express.Router();
const {
  loginUser,
  registerUser,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
  refreshAccessToken,
  logoutUser,        
} = require("../controllers/authController");
const {protect} = require("../middlewares/authMiddleware");

routes.post("/login", loginUser);
routes.post("/register", registerUser);
routes.post("/refresh-token", refreshAccessToken);
routes.post("/logout", logoutUser); 
routes.get("/me", protect, getMe);
routes.put("/profile",protect, updateProfile);
routes.put("/password", protect, changePassword);
routes.delete("/account", protect, deleteAccount);

module.exports = routes;
