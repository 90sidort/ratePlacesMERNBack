const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const { USERS } = require("../mocks");

const getUsersList = (req, res, next) => {
  if (USERS) {
    return res.status(200).json({ users: USERS });
  } else {
    return next(new HttpError("No user found.", 404));
  }
};

const getUser = (req, res, next) => {
  const user = USERS.find((u) => u.id === req.params.uid);
  if (user) {
    return res.status(200).json({ user });
  } else {
    return next(new HttpError("This user does not exist.", 404));
  }
};

const signup = (req, res, next) => {
  const { errors } = validationResult(req);
  console.log(errors);
  if (errors.length > 0) {
    return next(new HttpError("Invalid inputes, please check your data.", 404));
  }

  let alreadyExists = false;
  const { name, password, email } = req.body;

  USERS.forEach((user) => {
    if (user.email === email) {
      alreadyExists = true;
      return next(new HttpError("User already exists.", 404));
    }
  });

  if (!alreadyExists) {
    const newUser = { id: uuidv4(), name, password, email };
    USERS.push(newUser);
    return res.status(201).json({ user: newUser });
  }
};

const login = (req, res, next) => {
  if (req.body.email && req.body.password) {
    const { email, password } = req.body;
    USERS.forEach((user) => {
      if (user.email === email && user.password === password) {
        return res.status(200).send({ user });
      }
    });
    return next(new HttpError("Incorrect user data.", 404));
  } else {
    return next(new HttpError("Provide correct user data.", 404));
  }
};

module.exports = { getUsersList, getUser, signup, login };
