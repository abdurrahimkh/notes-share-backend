const express = require("express");
const { requireLogin } = require("../middlewares/requireLogin");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
  completeRegistration,
  allUsers,
} = require("../controllers/userController");
const { adminRequireLogin } = require("../middlewares/adminRequireLogin");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/google/complete", completeRegistration);
router.get("/me", requireLogin, getMe);
router.get("/allusers", adminRequireLogin, allUsers);

module.exports = router;
