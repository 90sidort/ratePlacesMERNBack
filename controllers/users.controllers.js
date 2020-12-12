const { validationResult } = require("express-validator");

const User = require("../models/user.model");
const HttpError = require("../models/http-error");

const getUsersList = async (req, res, next) => {
  try {
    const users = await User.find();
    return res
      .status(200)
      .json({ users: users.map((user) => user.toObject({ getters: true })) });
  } catch (e) {
    return next(new HttpError("Server error.", 500));
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.uid });
    if (!user) {
      return next(new HttpError("User with this id does not exist.", 404));
    } else {
      return res.status(200).json({ user: user.toObject({ getters: true }) });
    }
  } catch (e) {
    return next(new HttpError("Server error.", 500));
  }
};

const signup = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return next(new HttpError("Invalid inputes, please check your data.", 404));
  }
  const { name, password, email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new HttpError("User already exists.", 500));
    } else {
      const newUser = await new User({
        name,
        email,
        image: req.file.path,
        password,
        places: [],
      });
      await newUser.save();
      return res
        .status(201)
        .json({ user: newUser.toObject({ getters: true }) });
    }
  } catch (e) {
    return next(new HttpError("Signup failed.", 500));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser || existingUser.password !== password) {
      return next(
        new HttpError("User does not exists or incorrect password.", 401)
      );
    } else {
      return res.status(200).json({
        message: "Logged in!",
        user: existingUser.toObject({ getters: true }),
      });
    }
  } catch (e) {
    return next(new HttpError("Login failed.", 500));
  }
};

module.exports = { getUsersList, getUser, signup, login };
