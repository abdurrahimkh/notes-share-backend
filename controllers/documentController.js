const documentModel = require("../models/documentModel");
const valuesModel = require("../models/valuesModel");
const uploadDocument = async (req, res) => {
  const { url, title, course, subject, description, size, filetype } = req.body;
  try {
    const post = await documentModel.create({
      title,
      course,
      subject,
      description,
      url,
      size,
      filetype,
      postedBy: req.user,
    });
    console.log(post);
    if (post) {
      res.status(201).json({ message: "Document Uploaded..." });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const AllDocuments = async (req, res) => {
  try {
    const posts = await documentModel.find();
    if (posts) {
      res.status(200).send(posts);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const Approve = async (req, res) => {
  const id = req.params.id;
  try {
    const approve = await documentModel.findByIdAndUpdate(
      id,
      {
        status: "approved",
      },
      { new: true }
    );
    if (approve) {
      res.status(200).send(approve);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const Reject = async (req, res) => {
  const id = req.params.id;
  try {
    const reject = await documentModel.findByIdAndUpdate(
      id,
      {
        status: "rejected",
      },
      { new: true }
    );
    if (reject) {
      res.status(200).send(reject);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const approvedDocuments = async (req, res) => {
  try {
    const documents = await documentModel
      .find({ status: "approved" })
      .populate("postedBy", "name pic");
    if (documents) {
      res.status(200).send(documents);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const likeDocument = async (req, res) => {
  const { documentId } = req.params;
  const id = req.user._id;
  try {
    const document = await documentModel.findByIdAndUpdate(
      documentId,
      {
        $addToSet: { likes: id },
      },
      { new: true }
    );
    if (document) {
      res.status(200).send(document);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const valuesControl = async (req, res) => {
  try {
    const data = await valuesModel.find();
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  uploadDocument,
  AllDocuments,
  Approve,
  Reject,
  approvedDocuments,
  likeDocument,
  valuesControl,
};
