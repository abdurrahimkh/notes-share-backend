const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const crypto = require("crypto");
const documentModel = require("../models/documentModel");
const valuesModel = require("../models/valuesModel");
const userModel = require("../models/userModel");
const transport = require("../services/mailService");

/**
 * Register New User
 * POST /api/users
 */
const registerUser = async (req, res) => {
  const {
    email,
    password,
    name,
    gender,
    username,
    institute,
    dicipline,
    fieldofstudy,
  } = req.body;
  if (
    !name ||
    !email ||
    !password ||
    !gender ||
    !username ||
    !institute ||
    !dicipline ||
    !fieldofstudy
  ) {
    res.status(200);
    res.json({ error: "Please Add All Fields" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(200);
    return res.json({ error: "User Already Exists" });
  }
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    res.status(200);
    return res.json({ error: "Username already exists" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    gender,
    username,
    institute,
    dicipline,
    fieldofstudy,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      gender: user.gender,
      username: user.username,
      institute: user.institute,
      dicipline: user.dicipline,
      fieldofstudy: user.fieldofstudy,
      pic: user.pic,
      roel: user.role,
    });
  } else {
    throw new Error("Invalid User Details");
  }
};

/**
 * Login User
 * POST /api/login
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.json({ error: "Please Enter Email and Password" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User not exists" });
  }
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user.id),
      institute: user.institute,
      dicipline: user.dicipline,
      fieldofstudy: user.fieldofstudy,
      role: user.role,
    });
  } else {
    res.json({ error: "Invalid Email or Password" });
  }
};
/**
 * Get User Data
 * GET /api/users/me
 */
const getMe = async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);
  res.status(200).json({
    id: _id,
    name,
    email,
  });
};

/**
 * Google Login
 * POST /api/google
 */
const googleLogin = async (req, res) => {
  const { email, name } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(email, salt);
  const newUser = {
    name,
    email,
    password: hashedPassword,
    username: email.slice(0, -10),
    googlenew: false,
  };
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        gender: user.gender,
        username: user.username,
        institute: user.institute,
        dicipline: user.dicipline,
        fieldofstudy: user.fieldofstudy,
        pic: user.pic,
        googlenew: user.googlenew,
        role: user.role,
      });
    } else {
      const createNewUser = await User.create(newUser);
      if (createNewUser) {
        res.status(200).json({
          _id: createNewUser._id,
          name: createNewUser.name,
          email: createNewUser.email,
          pic: createNewUser.pic,
          token: generateToken(createNewUser._id),
          username: createNewUser.username,
          googlenew: createNewUser.googlenew,
          role: createNewUser.role,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Google Complete Registration
 * POST /api/google/complete
 */
const completeRegistration = async (req, res) => {
  const {
    _id,
    username,
    gender,
    institute,
    dicipline,
    fieldofstudy,
    googlenew,
  } = req.body;
  if (!gender || !username || !institute || !dicipline || !fieldofstudy) {
    res.status(200);
    return res.json({ error: "Please Add All Fields" });
  }
  try {
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      res.status(200);
      return res.json({ error: "Username already exists" });
    }
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          username,
          gender,
          institute,
          dicipline,
          fieldofstudy,
          googlenew: true,
        },
      },
      { new: true }
    );
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
        gender: user.gender,
        username: user.username,
        institute: user.institute,
        dicipline: user.dicipline,
        fieldofstudy: user.fieldofstudy,
        googlenew: user.googlenew,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/**
 * Get All Users
 * GET /api/users/allUsers
 */

const allUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    if (users) {
      res.status(200).send(users);
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Reset Passowrd
 * POST /api/users/forgetpassword
 */
const forgetPassword = async (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        console.log(err);
      }
      const token = buffer.toString("hex");
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(200).json({ error: "Email does not exists" });
      }
      user.resettoken = token;
      user.expiretoken = Date.now() + 3600000;
      await user.save();
      transport.sendMail({
        to: user.email,
        from: "noreply@notes-share.com",
        subject: "Password  Reset",
        html: `
                  <h2>Hi ${user.name},</h2>
                 <h3> There was a request to change your password!</h3>
                 <span>If you did not make this request then please ignore this email.</span>
                  <h4>  Otherwise, please click this link to change your password: <a  href="http://localhost:3000/forgetpassword/${token}">link</a> </h4>
                        `,
      });
      res.json({ message: "Email has been sent " });
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * New Passowrd
 * POST /api/users/newpassword
 */
const newPassword = async (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  const user = await User.findOne({
    resettoken: sentToken,
    expiretoken: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(200).json({ error: "Session Expired  Try Again!" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  user.password = hashedPassword;
  user.resettoken = undefined;
  user.expiretoken = undefined;
  const updated = user.save();
  if (updated) {
    res.status(201).json({ message: "Password Updated Successfully" });
  }
};

/**
 * User Profile
 * GET /api/users/profile/:id
 */
const userProfile = async (req, res) => {
  const id = req.params;
  const _id = id;
  try {
    const user = await User.findById(id);
    const documents = await documentModel
      .find({
        status: "approved",
        postedBy: _id,
      })
      .populate("postedBy", "_id");

    if (user) {
      res.status(200).json({ user, documents });
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * ADD VALUE
 * PUT /api/users/addvalue
 */
const addValue = async (req, res) => {
  const { id, newValue, field } = req.body;

  if (id === "62df6ccc14cb3a595f1c581d") {
    try {
      const updated = await valuesModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { universities: { label: newValue, value: newValue } },
        },
        { new: true }
      );
      res.status(201).send(updated);
    } catch (error) {
      console.log(error);
    }
  } else if (id === "62e0de0f5a25e2cd79eec494") {
    try {
      const updated = await valuesModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { fieldofstudy: { label: newValue, value: newValue } },
        },
        { new: true }
      );
      res.status(201).send(updated);
    } catch (error) {
      console.log(error);
    }
  } else if (id === "62e36574bca949a2bfca94ee") {
    try {
      const updated = await valuesModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { subjects: { label: newValue, value: newValue, field } },
        },
        { new: true }
      );
      res.status(201).send(updated);
    } catch (error) {
      console.log(error);
    }
  }
};

/**
 * Delete Value
 * PUT /api/users/addvalue
 */
const deleteValue = async (req, res) => {
  const { id, value } = req.body;

  if (id === "62df6ccc14cb3a595f1c581d") {
    try {
      const updated = await valuesModel.findByIdAndUpdate(
        id,
        {
          $pull: { universities: { label: value } },
        },
        { new: true }
      );
      if (updated) {
        const data = await valuesModel.find();
        res.status(201).send(data);
      }
    } catch (error) {
      console.log(error);
    }
  } else if (id === "62e0de0f5a25e2cd79eec494") {
    try {
      const updated = await valuesModel.findByIdAndUpdate(
        id,
        {
          $pull: { fieldofstudy: { label: value } },
        },
        { new: true }
      );
      if (updated) {
        const data = await valuesModel.find();
        res.status(201).send(data);
      }
    } catch (error) {
      console.log(error);
    }
  } else if (id === "62e36574bca949a2bfca94ee") {
    try {
      const updated = await valuesModel.findByIdAndUpdate(
        id,
        {
          $pull: { subjects: { label: value } },
        },
        { new: true }
      );
      if (updated) {
        const data = await valuesModel.find();
        res.status(201).send(data);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

/**
 * Update Profile Picture
 * PUT /api/users/profile/picupdate/:id
 */
const updatePicture = async (req, res) => {
  const _id = req.params;
  try {
    const updatePic = await User.findByIdAndUpdate(
      _id,
      {
        pic: req.body.pic,
      },
      {
        new: true,
      }
    );

    if (updatePic) {
      res
        .status(200)
        .json({ message: "Update Successful", pic: updatePic.pic });
    }
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
};

/**
 * Update Profile Picture
 * PUT /api/users/profile/update/:id
 */

const profileUpdate = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user) {
      user.email = req.body.email || user.email;
      user.name = req.body.name || user.name;
      user.username = req.body.username || user.username;
      user.gender = req.body.gender || user.gender;
      user.fieldofstudy = req.body.fieldofstudy || user.fieldofstudy;
      user.dicipline = req.body.dicipline || user.dicipline;
      user.institute = req.body.institute || user.institute;

      const updateInfo = await user.save();
      res.send(updateInfo);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const passwordUpdate = async (req, res) => {
  const currenPassword = req.body.currentpassword;
  const newPassword = req.body.newpassword;
  if (currenPassword === undefined || newPassword === undefined) {
    return res.json({ error: "Fill Both Fields" });
  }
  try {
    const user = await userModel.findById(req.user._id);
    if (user) {
      if (currenPassword) {
        const matched = await bcrypt.compare(currenPassword, user.password);
        if (matched) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);
          user.password = hashedPassword;
          await user.save();
          return res.json({ message: "Password Changed Successfully" });
        } else {
          return res.json({ error: "Incorrect Current Password" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

const contactUs = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    transport.sendMail({
      to: "abdurrahimkhan95710@gmail.com",
      from: "Notes Share",
      subject: "Message From Notes Share",
      html: `
      <div style="width: 100%; background-color: #f3f9ff; padding: 5rem 0">
        <div style="max-width: 700px; background-color: white; margin: 0 auto">
          <div style="width: 100%; background-color: #0000FF; padding: 20px 0">
          </div>
          <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">
            <p style="font-weight: 800; font-size: 1.2rem; padding: 0 30px">
              From Notes Share
            </p>
            <div style="font-size: .8rem; margin: 0 30px">
              <p>Name: <b>${name}</b></p>
              <p>Email: <b>${email}</b></p>
              <p>Message: <i>${message}</i></p>
            </div>
          </div>
        </div>
      </div>
      `,
    });
    res.json({ message: "Email Sent" });
  } catch (error) {}
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
  completeRegistration,
  allUsers,
  forgetPassword,
  newPassword,
  userProfile,
  addValue,
  updatePicture,
  profileUpdate,
  passwordUpdate,
  deleteValue,
  contactUs,
};
