const QuestionModel = require("../models/QuestionModel");

const addQuestion = async (req, res) => {
  try {
    const question = await QuestionModel.create({
      title: req.body.title,
      subject: req.body.subject,
      description: req.body.description || null,
      postedBy: req.user._id,
    });
    if (question) {
      res.json({ message: "Question Added Successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteQuestion = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedDocument = await QuestionModel.findByIdAndDelete(id);
    if (deletedDocument) {
      const allDocuments = await QuestionModel.find()
        .populate("postedBy", "name pic")
        .sort({ createdAt: -1 });
      if (allDocuments) {
        res.status(200).send(allDocuments);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const allQuestions = async (req, res) => {
  try {
    const questions = await QuestionModel.find()
      .populate("postedBy", "name pic")
      .sort({ createdAt: -1 });
    if (questions) {
      res.send(questions);
    }
  } catch (error) {
    console.log(error);
  }
};

const addAnswer = async (req, res) => {
  const id = req.body.id;
  const text = req.body.text;
  try {
    const comment = await QuestionModel.findByIdAndUpdate(
      id,
      {
        $push: {
          answers: {
            text,
            file: req.body.file || null,
            answerBy: req.user._id,
          },
        },
      },
      { new: true }
    )
      .populate("postedBy", "name pic")
      .populate("answers.answerBy", "name pic");
    if (comment) {
      res.send(comment);
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteAnswer = async (req, res) => {
  const postId = req.body.postId;
  const commentId = req.body.commentId;
  try {
    const comment = await QuestionModel.findByIdAndUpdate(
      postId,
      {
        $pull: {
          answers: {
            _id: commentId,
          },
        },
      },
      { new: true }
    )
      .populate("postedBy", "name pic")
      .populate("answers.answerBy", "name pic");
    if (comment) {
      res.send(comment);
    }
  } catch (error) {
    console.log(error);
  }
};

const questionDetails = async (req, res) => {
  const id = req.params;
  try {
    const question = await QuestionModel.findById(id)
      .populate("postedBy", "name pic")
      .populate("answers.answerBy", "_id name pic");
    if (question) {
      res.send(question);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addQuestion,
  deleteQuestion,
  allQuestions,
  addAnswer,
  deleteAnswer,
  questionDetails,
};
