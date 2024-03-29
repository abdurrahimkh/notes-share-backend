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
  forgetPassword,
  newPassword,
  userProfile,
  updatePicture,
  profileUpdate,
  passwordUpdate,
  deleteValue,
  contactUs,
} = require("../controllers/userController");
const { adminRequireLogin } = require("../middlewares/adminRequireLogin");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/google/complete", completeRegistration);
router.get("/me", requireLogin, getMe);
router.get("/allusers", adminRequireLogin, allUsers);
router.post("/forgetpassword", forgetPassword);
router.post("/newPassword", newPassword);
router.get("/profile/:_id", userProfile);
router.put("/deletevalue", deleteValue);
router.put("/profile/picupdate/:_id", updatePicture);
router.put("/profile/update", requireLogin, profileUpdate);
router.put("/profile/passwordupdate", requireLogin, passwordUpdate);
router.post("/contact-us", contactUs);

module.exports = router;
