const valuesModel = require("../models/valuesModel");

const addField = async (req, res) => {
  try {
    const list = await valuesModel.find();
    let match = false;
    if (list.length > 0) {
      list.map(field => {
        if (field.label.toLowerCase() === req.body.field.toLowerCase()) {
          match = true;
        }
      });
    }
    if (match) {
      return res.json({ error: "Field Already Found" });
    } else {
      const newField = {
        label: req.body.field,
        value: req.body.field,
      };
      const add = await valuesModel.create(newField);
      return res.send(add);
    }
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
    const list = await valuesModel.findById(req.body.fieldId);
    let match = false;
    if (list) {
      list.subjects.map(subject => {
        if (subject.label.toLowerCase() === req.body.subject.toLowerCase()) {
          match = true;
        }
      });
    }
    if (match) {
      return res.json({ error: "Subject Already Found" });
    } else {
      const add = await valuesModel.findByIdAndUpdate(
        req.body.fieldId,
        {
          $push: {
            subjects: { label: req.body.subject, value: req.body.subject },
          },
        },
        { new: true }
      );
      return res.send(add);
    }
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
    const all = await valuesModel.find().sort({ value: 1 });
    res.send(all);
  } catch (error) {
    console.log(error);
  }
};

const allSubjects = async (req, res) => {
  try {
    const all = await valuesModel.aggregate([{ $group: { _id: "$subjects" } }]);
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
  allSubjects,
};
