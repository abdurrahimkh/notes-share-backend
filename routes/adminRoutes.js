const express = require("express");
const router = express.Router();
const { loginAdmin, registerAdmin } = require("../controllers/adminController");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

module.exports = router;
