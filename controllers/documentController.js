const documentModel = require("../models/documentModel");

const uploadDocument = async (req, res) => {
  const { url, title, course, subject, discription, size, filetype, postedBy } =
    req.body;
  try {
    const post = await documentModel.create({
      title,
      course,
      subject,
      discription,
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
    const documents = await documentModel.find({ status: "approved" });
    if (documents) {
      res.status(200).send(documents);
    }
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
};
