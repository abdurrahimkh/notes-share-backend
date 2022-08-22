const uniModel = require("../models/unisModel");

const addUni = async (req, res) => {
  try {
    const check = await uniModel.findOne({ label: req.body.university });
    if (check) {
      return res.send({ error: "University already found" });
    }
    const newField = {
      label: req.body.university,
      value: req.body.university,
    };
    const add = await uniModel.create(newField);
    console.log(add);
    return res.send(add);
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
