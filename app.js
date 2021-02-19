const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

require("./db/mongoose.js");
const placesRouter = require("./routes/places.routes");
const userRouters = require("./routes/users.routes");
const errorController = require("./controllers/error.controllers");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use("/api/places", placesRouter);
app.use("/api/users", userRouters);

app.use(errorController);
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (error) => {
      console.log(error);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured." });
});

module.exports = app;
