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

const getUsers = async (req, res, next) => {
  try {
    if (req.body.usersIdsFollowed || req.body.userIdsFollowers) {
      const followed = await User.find({
        _id: { $in: req.body.usersIdsFollowed },
      }).select("name image _id");
      const followers = await User.find({
        _id: { $in: req.body.userIdsFollowers },
      }).select("name image _id");
      return res.status(200).json({ followed, followers });
    }
    return res.json({ followed: [], followers: [] });
  } catch (e) {}
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

const getPopular = async (req, res, next) => {
  try {
    const users = await User.aggregate([
      {
        $project: {
          name: 1,
          email: 1,
          about: 1,
          image: 1,
          places: 1,
          following: 1,
          followers: 1,
          about: 1,
          length: { $size: "$followers" },
        },
      },
      { $sort: { length: -1 } },
      { $limit: 5 },
    ]);
    return res.status(200).json({ users });
  } catch (e) {
    return next(new HttpError("Server error.", 500));
  }
};

const signup = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    let errorMessage = "";
    await errors.forEach((e) => {
      errorMessage = errorMessage + `${e.param.toUpperCase()}: ${e.msg}` + "\n";
    });
    return next(new HttpError(errorMessage, 422));
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
        image: req.file ? req.file.path : "placeholder",
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
          userName: existingUser.name,
        });
      }
    }
  } catch (e) {
    return next(new HttpError("Login failed.", 500));
  }
};

const followUser = async (req, res, next) => {
  try {
    if (req.userData.userId.toString() === req.params.uid.toString()) {
      return next(new HttpError("Cannot follow yourself.", 400));
    }
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

const updateUser = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    let errorMessage = "";
    await errors.forEach((e) => {
      errorMessage = errorMessage + `${e.param.toUpperCase()}: ${e.msg}` + "\n";
    });
    return next(new HttpError(errorMessage, 422));
  }
  const { name, about, email } = await req.body;
  try {
    const user = await User.findById({ _id: req.params.uid }).select(
      "_id name about email image"
    );
    if (!user) {
      return next(new HttpError("User with this id does not exist.", 404));
    } else {
      if (user._id.toString() !== req.userData.userId) {
        return next(new HttpError("Authorization error.", 401));
      }
      user.name = name;
      user.email = email;
      user.about =
        about.trim().length === 0
          ? "Hi, maybe you'll tell us a bit about yourself"
          : about;
      user.image = req.file ? req.file.path : user.image;
      await user.save();
      return res.status(200).json({ user: user.toObject({ getters: true }) });
    }
  } catch (e) {
    return next(new HttpError("Server error.", 500));
  }
};

module.exports = {
  getUsersList,
  getUser,
  signup,
  login,
  followUser,
  unfollowUser,
  getUsers,
  updateUser,
  getPopular,
};
