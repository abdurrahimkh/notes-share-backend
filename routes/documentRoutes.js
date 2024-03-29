const express = require("express");
const { adminRequireLogin } = require("../middlewares/adminRequireLogin");
const {
  uploadDocument,
  AllDocuments,
  documentDetails,
  Approve,
  Reject,
  approvedDocuments,
  deleteDocument,
  likeDocument,
  valuesControl,
  Search,
  documentReview,
  addComment,
  deleteComment,
  recentDocuments,
} = require("../controllers/documentController");
const { requireLogin } = require("../middlewares/requireLogin");
const router = express.Router();

router.post("/upload", requireLogin, uploadDocument);
router.delete("/delete/:id", deleteDocument);
router.get("/documents", AllDocuments);
router.get("/document/:id", documentDetails);
router.post("/approve/:id", adminRequireLogin, Approve);
router.post("/reject/:id", adminRequireLogin, Reject);
router.get("/approved", approvedDocuments);
router.get("/recent", recentDocuments);
router.post("/like/:documentId", requireLogin, likeDocument);
router.get("/values", valuesControl);
router.get("/search", Search);
router.post("/document/review", requireLogin, documentReview);
router.put("/document/comments", requireLogin, addComment);
router.delete("/document/comments", requireLogin, deleteComment);

module.exports = router;
