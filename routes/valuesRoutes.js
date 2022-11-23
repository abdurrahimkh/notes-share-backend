const express = require("express");
const router = express.Router();
const {
  addField,
  addSubject,
  allFields,
  deleteField,
  deleteSubject,
  allSubjects,
} = require("../controllers/valuesController");

router.post("/addfield", addField);
router.delete("/deletefield", deleteField);
router.post("/addsubject", addSubject);
router.delete("/deletesubject", deleteSubject);
router.get("/all", allFields);
router.get("/allsubjects", allSubjects);

module.exports = router;
