const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user.model");
const HttpError = require("../models/http-error");

const getUsersList = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password");
    return res
      .status(200)
      .json({ users: users.map((user) => user.toObject({ getters: true })) });
  } catch (e) {
    return next(new HttpError("Server error.", 500));
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.uid }, "-password");
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
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await new User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: [],
      });
      await newUser.save();

      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res
        .status(201)
        .json({ userId: newUser.id, email: newUser.email, token: token });
    }
  } catch (e) {
    return next(new HttpError("Signup failed.", 500));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new HttpError("User does not exists.", 403));
    } else {
      const isValidPassword = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isValidPassword) {
        return next(new HttpError("Incorrect password!"));
      } else {
        const token = jwt.sign(
          { userId: existingUser.id, email: existingUser.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        return res.status(200).json({
          userId: existingUser.id,
          email: existingUser.email,
          token: token,
        });
      }
    }
  } catch (e) {
    return next(new HttpError("Login failed.", 500));
  }
};

const followUser = async (req, res, next) => {
  try {
    const follower = await User.findById(req.userData.userId);
    const followed = await User.findById(req.params.uid);
    if (follower && followed) {
      if (
        !follower.following.includes(followed._id) &&
        !followed.followers.includes(follower._id)
      ) {
        const session = await mongoose.startSession();
        session.startTransaction();
        follower.following.push(followed._id);
        followed.followers.push(follower._id);
        await followed.save({ session });
        await follower.save({ session });
        await session.commitTransaction();
        return res.status(201).json({
          follow: follower.following,
          followed: followed.followers.length,
        });
      } else {
        return next(new HttpError("Already following this user.", 400));
      }
    } else {
      return next(new HttpError("Unable to find users.", 400));
    }
  } catch (err) {
    return next(new HttpError("Unable to follow user.", 500));
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const follower = await User.findById(req.userData.userId);
    const followed = await User.findById(req.params.uid);
    if (follower && followed) {
      const indexFollower = follower.following.indexOf(followed._id);
      const indexFollowed = followed.followers.indexOf(follower._id);
      const session = await mongoose.startSession();
      session.startTransaction();
      follower.following.splice(indexFollower, 1);
      followed.followers.splice(indexFollowed, 1);
      await followed.save({ session });
      await follower.save({ session });
      await session.commitTransaction();
      return res.status(201).json({
        follow: follower.following,
        followed: followed.followers.length,
      });
    } else {
      return next(new HttpError("Unable to find users.", 400));
    }
  } catch (err) {
    return next(new HttpError("Unable to unfollow user.", 500));
  }
};

module.exports = {
  getUsersList,
  getUser,
  signup,
  login,
  followUser,
  unfollowUser,
};
