const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { MONGO_URI } = require("./config");
const placesRouter = require("./routes/places.routes");
const userRouters = require("./routes/users.routes");
const errorController = require("./controllers/error.controllers");

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRouter);
app.use("/api/users", userRouters);

app.use(errorController);
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured." });
});

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(5000);
  })
  .catch(() => console.log("unnable to connect"));
