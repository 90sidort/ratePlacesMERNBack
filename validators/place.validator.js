const { body } = require("express-validator");

const validatePlace = [
  body("title")
    .trim()
    .isLength({
      min: 1,
      max: 300,
    })
    .withMessage("Cannot be shorter than 1 and longer than 300 characters"),
  body("about")
    .trim()
    .isLength({
      min: 5,
      max: 1000,
    })
    .withMessage("Cannot be longer than 1000"),
  body("address")
    .trim()
    .isLength({
      min: 1,
      max: 300,
    })
    .withMessage("Cannot be shorter than 1 and longer than 300 characters"),
  body("description")
    .trim()
    .isLength({
      max: 6000,
    })
    .withMessage("Cannot be longer than 6000 characters"),
  body("type")
    .trim()
    .isLength({
      min: 1,
    })
    .isIn(["monument", "site", "event", "other"])
    .withMessage(
      "Cannot be shorter than 1 character and has to be monument /site /event /other"
    ),
];

module.exports = validatePlace;
