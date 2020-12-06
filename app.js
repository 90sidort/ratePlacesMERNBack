const express = require("express");
const bodyParser = require("body-parser");

const placesRouter = require("./routes/places.routes");
const userRouters = require("./routes/users.routes");
const errorController = require("./controllers/error.controllers");

const app = express();

app.use(bodyParser.json());
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

app.listen(5000);
