const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const adminRequireLogin = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("REQUIRE LOGIN", token);
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Admin.findById(decode.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not Authorized");
    }
  }
  if (!token) {
    throw new Error("Not Authorized No Token");
  }
};

module.exports = { adminRequireLogin };
