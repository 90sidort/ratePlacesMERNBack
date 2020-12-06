const HttpError = require("../models/http-error");

const errorController = (req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
};

module.exports = errorController;
