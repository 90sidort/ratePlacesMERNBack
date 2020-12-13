const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

const requireLogin = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(new HttpError("Authentication failed!", 401));
    }
    const decoded = jwt.verify(token, "this_is_the_number_2137");
    req.userData = { userId: decoded.userId };
    next();
  } catch (e) {
    return next(new HttpError("Authentication failed!", 401));
  }
};

module.exports = requireLogin;
