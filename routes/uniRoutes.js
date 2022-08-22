const express = require("express");
const router = express.Router();
const { addUni, uniList, deleteUni } = require("../controllers/uniController");

router.get("/all", uniList);
router.put("/adduni", addUni);
router.delete("/deleteuni", deleteUni);

module.exports = router;
