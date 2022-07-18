const express = require("express");
const { adminRequireLogin } = require("../middlewares/adminRequireLogin");
const {
  uploadDocument,
  AllDocuments,
  Approve,
  Reject,
  approvedDocuments,
} = require("../controllers/documentController");
const { requireLogin } = require("../middlewares/requireLogin");
const router = express.Router();

router.post("/upload", requireLogin, uploadDocument);
router.get("/documents", AllDocuments);
router.post("/approve/:id", adminRequireLogin, Approve);
router.post("/reject/:id", adminRequireLogin, Reject);
router.get("/approved", requireLogin, approvedDocuments);

module.exports = router;
