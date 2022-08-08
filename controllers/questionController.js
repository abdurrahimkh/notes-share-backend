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
    );
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
    );
    if (comment) {
      res.send(comment);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addQuestion,
  allQuestions,
  addAnswer,
  deleteAnswer,
};
