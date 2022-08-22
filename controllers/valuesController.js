const valuesModel = require("../models/valuesModel");

const addField = async (req, res) => {
  try {
    const newField = {
      label: req.body.field,
      value: req.body.field,
    };
    const add = await valuesModel.create(newField);
    res.send(add);
  } catch (error) {
    console.log(error);
  }
};

const deleteField = async (req, res) => {
  const id = req.body.id;
  try {
    const done = await valuesModel.findByIdAndDelete(id);
    if (done) {
      const all = await valuesModel.find();
      res.send(all);
    }
  } catch (error) {
    console.log(error);
  }
};

const addSubject = async (req, res) => {
  try {
    const add = await valuesModel.findByIdAndUpdate(
      req.body.fieldId,
      {
        $addToSet: {
          subjects: { label: req.body.subject, value: req.body.subject },
        },
      },
      { new: true }
    );
    res.send(add);
  } catch (error) {
    console.log(error);
  }
};
const deleteSubject = async (req, res) => {
  const subjectId = req.body.subjectId;
  try {
    const del = await valuesModel.findByIdAndUpdate(
      req.body.fieldId,
      {
        $pull: {
          subjects: { _id: subjectId },
        },
      },
      { new: true }
    );
    res.send(del);
  } catch (error) {
    console.log(error);
  }
};

const allFields = async (req, res) => {
  try {
    const all = await valuesModel.find({});
    res.send(all);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addField,
  addSubject,
  allFields,
  deleteField,
  deleteSubject,
};
