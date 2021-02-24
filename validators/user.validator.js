const { body } = require("express-validator");

const validateUser = [
  body("name")
    .trim()
    .isLength({
      min: 1,
      max: 100,
    })
    .withMessage("Requires at least 1 chars and max 100 chars"),
  body("email").trim().isEmail().withMessage("Requires valid email"),
  body("about")
    .trim()
    .isLength({
      max: 150,
    })
    .withMessage("150 chars max!"),
  body("password")
    .trim()
    .isLength({
      min: 6,
      max: 16,
    })
    .withMessage("Requires at least 6 chars and max 16 chars"),
];

const validateUserUpdate = [
  body("name")
    .trim()
    .isLength({
      min: 1,
      max: 100,
    })
    .withMessage("Requires at least 1 chars and max 100 chars"),
  body("email").trim().isEmail().withMessage("Requires valid email"),
  body("about")
    .trim()
    .isLength({
      max: 150,
    })
    .withMessage("150 chars max!"),
];

module.exports = { validateUser, validateUserUpdate };
