const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  registerAdmin,
  deleteUser,
  changeEmail,
  changePassword,
} = require("../controllers/adminController");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.delete("/delete/user/:id", deleteUser);
router.put("/profile/email", changeEmail);
router.put("/profile/password", changePassword);

module.exports = router;
