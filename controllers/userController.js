const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { OAuth2Client } = require("google-auth-library");
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
    res.status(400);
    res.json({ error: "Please Add All Fields" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    res.json({ error: "User Already Exists" });
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
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
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
const client = new OAuth2Client(
  "159965697116-t8suhldq94ikeggogj0bevifgqbtcvjj.apps.googleusercontent.com"
);
const googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const response = await client.verifyIdToken({
      idToken: tokenId,
      audience:
        "159965697116-t8suhldq94ikeggogj0bevifgqbtcvjj.apps.googleusercontent.com",
    });

    const { email, name } = response.payload;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(email, salt);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      username: email.slice(0, -10),
      // gender="male",
      // institute=null,
      // dicipline=null,
      // fieldofstudy=null,
    };
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
      });
    } else {
      const user = await User.create(newUser);
      res.json({ user });
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

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
};
