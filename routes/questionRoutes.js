const express = require("express");
const router = express.Router();

const { requireLogin } = require("../middlewares/requireLogin");
const {
  addQuestion,
  allQuestions,
  addAnswer,
  deleteAnswer,
} = require("../controllers/questionController");

router.post("/questions", requireLogin, addQuestion);
router.get("/questions", allQuestions);
router.put("/answers", requireLogin, addAnswer);
router.delete("/answers", requireLogin, deleteAnswer);

module.exports = router;
