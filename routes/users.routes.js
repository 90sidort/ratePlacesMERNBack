const express = require("express");
const { check } = require("express-validator");

const {
  getUsersList,
  getUser,
  signup,
  login,
} = require("../controllers/users.controllers");

const userRouters = express.Router();

userRouters.get("/", getUsersList);

userRouters.get("/:uid", getUser);

userRouters.post(
  "/signup",
  [
    check("password").not().isEmpty(),
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
  ],
  signup
);

userRouters.post("/login", login);

module.exports = userRouters;
