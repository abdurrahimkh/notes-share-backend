const express = require("express");
const router = express.Router();
const {
  addField,
  addSubject,
  allFields,
  deleteField,
  deleteSubject,
} = require("../controllers/valuesController");

router.post("/addfield", addField);
router.delete("/deletefield", deleteField);
router.post("/addsubject", addSubject);
router.delete("/deletesubject", deleteSubject);
router.get("/all", allFields);

module.exports = router;
