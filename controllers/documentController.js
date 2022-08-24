const documentModel = require("../models/documentModel");
const valuesModel = require("../models/valuesModel");
const uploadDocument = async (req, res) => {
  const { url, title, course, subject, description, size, filetype, field } =
    req.body;
  try {
    const post = await documentModel.create({
      title,
      course,
      subject,
      description,
      url,
      size,
      filetype,
      field,
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

const deleteDocument = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedDocument = await documentModel.findByIdAndDelete(id);
    if (deletedDocument) {
      res.status(200).send(deletedDocument);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const AllDocuments = async (req, res) => {
  try {
    const posts = await documentModel
      .find()
      .populate("postedBy", "name username email")
      .sort({ createdAt: -1 });
    if (posts) {
      res.status(200).send(posts);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const documentDetails = async (req, res) => {
  const id = req.params.id;
  try {
    const document = await documentModel
      .findById(id)
      .populate("postedBy", "name username email pic")
      .populate("comments.postedBy", "name pic");
    if (document) {
      res.send(document);
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

const recentDocuments = async (req, res) => {
  try {
    const documents = await documentModel
      .find({ status: "approved" })
      .populate("postedBy", "name pic")
      .sort({ createdAt: -1 })
      .limit(10);
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

const Search = async (req, res) => {
  try {
    const searchField = req.query.field;
    const searchSubject = req.query.subject;

    const data = await documentModel
      .find({
        status: "approved",
        $or: [{ field: searchField }, { subject: searchSubject }],
      })
      .populate("postedBy", "name pic");
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const documentReview = async (req, res) => {
  const { rating, comment, documentId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  try {
    const document = await documentModel.findById(documentId);
    const isReviewed = document.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );
    if (isReviewed) {
      document.reviews.forEach(r => {
        if (r.user.toString() === req.user._id.toString()) {
          r.comment = comment;
          r.rating = rating;
        }
      });
    } else {
      document.reviews.push(review);
      document.noOfReviews = document.reviews.length;
    }
    document.ratings =
      document.reviews.reduce((acc, item) => item.rating + acc, 0) /
      document.reviews.length;

    await document.save({ validateBeforeSave: false });
    const result = await documentModel
      .findById(documentId)
      .populate("postedBy", "name username email pic")
      .populate("comments.postedBy", "name pic");
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const addComment = async (req, res) => {
  const id = req.body.id;
  const text = req.body.text;
  try {
    const comment = await documentModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            comments: {
              text,
              postedBy: req.user._id,
            },
          },
        },
        { new: true }
      )
      .populate("comments.postedBy", "name pic");
    if (comment) {
      res.send(comment);
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteComment = async (req, res) => {
  const postId = req.body.postId;
  const commentId = req.body.commentId;
  try {
    const comment = await documentModel
      .findByIdAndUpdate(
        postId,
        {
          $pull: {
            comments: {
              _id: commentId,
            },
          },
        },
        { new: true }
      )
      .populate("postedBy", "name pic")
      .populate("comments.postedBy", "name pic");
    if (comment) {
      res.send(comment);
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  uploadDocument,
  documentDetails,
  AllDocuments,
  Approve,
  Reject,
  approvedDocuments,
  likeDocument,
  valuesControl,
  Search,
  deleteDocument,
  documentReview,
  addComment,
  deleteComment,
  recentDocuments,
};
