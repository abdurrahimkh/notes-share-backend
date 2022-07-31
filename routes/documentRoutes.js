const express = require("express");
const { adminRequireLogin } = require("../middlewares/adminRequireLogin");
const {
  uploadDocument,
  AllDocuments,
  Approve,
  Reject,
  approvedDocuments,
  userDocuments,
  likeDocument,
  valuesControl,
  Search,
} = require("../controllers/documentController");
const { requireLogin } = require("../middlewares/requireLogin");
const router = express.Router();

router.post("/upload", requireLogin, uploadDocument);
router.get("/documents", AllDocuments);
router.post("/approve/:id", adminRequireLogin, Approve);
router.post("/reject/:id", adminRequireLogin, Reject);
router.get("/approved", approvedDocuments);
router.post("/like/:documentId", requireLogin, likeDocument);
router.get("/values", valuesControl);
router.get("/search", Search);

module.exports = router;
