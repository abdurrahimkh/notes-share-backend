const express = require("express");
const { requireLogin } = require("../middlewares/requireLogin");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/me", requireLogin, getMe);

module.exports = router;
