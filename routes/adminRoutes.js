const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  registerAdmin,
  deleteUser,
} = require("../controllers/adminController");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.delete("/delete/user/:id", deleteUser);

module.exports = router;
