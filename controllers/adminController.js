const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/adminModel");

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
const registerAdmin = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(400);
    res.json({ error: "Please Add All Fields" });
  }

  const userExists = await Admin.findOne({ email });
  if (userExists) {
    res.status(400);
    res.json({ error: "User Already Exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await Admin.create({
    name,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    throw new Error("Invalid User Details");
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.json({ error: "Please Enter Email and Password" });
  }
  const user = await Admin.findOne({ email });
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

module.exports = {
  registerAdmin,
  loginAdmin,
};
