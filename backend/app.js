// all my express config stuff

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  req.user = { userId: 1 };
  next();
});

const jobAppRoutes = require("./routes/jobAppRoutes");
app.use("/api/jobs", jobAppRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

module.exports = app;
