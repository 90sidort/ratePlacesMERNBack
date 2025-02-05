const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

const requireLogin = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(new HttpError("Authentication failed!", 403));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decoded.userId };
    next();
  } catch (e) {
    return next(new HttpError("Authentication failed!", 403));
  }
};

module.exports = requireLogin;
