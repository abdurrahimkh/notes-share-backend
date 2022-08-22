const mongoose = require("mongoose");
const { MONGO_URI } = process.env;

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
