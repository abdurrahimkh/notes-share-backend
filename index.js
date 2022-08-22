const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
var cors = require("cors");
const PORT = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api", require("./routes/questionRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/values", require("./routes/valuesRoutes"));
app.use("/api/universities", require("./routes/uniRoutes"));

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
