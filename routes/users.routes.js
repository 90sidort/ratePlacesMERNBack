const express = require("express");

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
  updateUser,
  getPopular,
  archiveUser,
} = require("../controllers/users.controllers");

const {
  validateUser,
  validateUserUpdate,
} = require("../validators/user.validator");

const userRouters = express.Router();

userRouters.get("/", getUsersList);

userRouters.get(`/popular`, getPopular);

userRouters.get("/:uid", getUser);

userRouters.patch("/details/get", getUsers);

userRouters.route("/follow/:uid").put(requireLogin, followUser);

userRouters.route("/unfollow/:uid").put(requireLogin, unfollowUser);

userRouters.post("/signup", fileUpload.single("image"), validateUser, signup);

userRouters.patch(
  "/:uid",
  requireLogin,
  fileUpload.single("image"),
  validateUserUpdate,
  updateUser
);

userRouters.post("/login", login);

userRouters.patch("/archive/:uid", requireLogin, archiveUser);

module.exports = userRouters;
