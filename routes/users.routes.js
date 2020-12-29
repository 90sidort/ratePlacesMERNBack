const express = require("express");
const { check } = require("express-validator");

const fileUpload = require("../middleware/file_upload");
const requireLogin = require("../middleware/auth-check");
const {
  getUsersList,
  getUser,
  signup,
  login,
  followUser,
  unfollowUser,
  getUsers,
} = require("../controllers/users.controllers");

const userRouters = express.Router();

userRouters.get("/", getUsersList);

userRouters.get("/:uid", getUser);

userRouters.patch("/details/get", getUsers);

userRouters.route("/follow/:uid").put(requireLogin, followUser);

userRouters.route("/unfollow/:uid").put(requireLogin, unfollowUser);

userRouters.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("password").isLength(6),
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
  ],
  signup
);

userRouters.post("/login", login);

module.exports = userRouters;
