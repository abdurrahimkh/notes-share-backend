const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
var cors = require("cors");
const PORT = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
