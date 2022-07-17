const express = require("express");
const {
  uploadDocument,
  AllDocuments,
} = require("../controllers/documentController");
const { requireLogin } = require("../middlewares/requireLogin");
const router = express.Router();

router.post("/upload", requireLogin, uploadDocument);
router.get("/alllist", AllDocuments);

module.exports = router;
