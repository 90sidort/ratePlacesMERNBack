const express = require("express");
const { check } = require("express-validator");

const {
  getPlaceById,
  getPlacesByUser,
  createPlace,
  deletePlace,
  updatePlace,
} = require("../controllers/places.controllers");

const fileUpload = require("../middleware/file_upload");

const placesRouter = express.Router();

placesRouter.get("/user/:uid", getPlacesByUser);

placesRouter.get("/:pid", getPlaceById);

placesRouter.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength(5),
    check("address").not().isEmpty(),
  ],
  createPlace
);

placesRouter.patch(
  "/:pid",
  fileUpload.single("image"),
  [check("title").not().isEmpty(), check("description").isLength(5)],
  updatePlace
);

placesRouter.delete("/:pid", deletePlace);

module.exports = placesRouter;
