const uniModel = require("../models/unisModel");

const addUni = async (req, res) => {
  try {
    const list = await uniModel.find();
    let match = false;
    if (list.length > 0) {
      list.map(uni => {
        if (uni.label.toLowerCase() === req.body.university.toLowerCase()) {
          match = true;
        }
      });
    }
    if (match) {
      return res.json({ error: "University Already Found" });
    } else {
      const newField = {
        label: req.body.university,
        value: req.body.university,
      };
      const add = await uniModel.create(newField);
      return res.send(add);
    }
  } catch (error) {
    console.log(error);
  }
};

const uniList = async (req, res) => {
  try {
    const all = await uniModel.find({}).sort({ label: 1 });
    res.send(all);
  } catch (error) {
    console.log(error);
  }
};

const deleteUni = async (req, res) => {
  const id = req.body.id;
  try {
    const del = await uniModel.findByIdAndDelete(id);
    if (del) {
      const all = await uniModel.find();
      if (all) {
        return res.send(all);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addUni,
  uniList,
  deleteUni,
};
