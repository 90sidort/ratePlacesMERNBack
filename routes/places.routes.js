const express = require("express");

const {
  getPlaceById,
  getPlacesByUser,
  createPlace,
  deletePlace,
  updatePlace,
} = require("../controllers/places.controllers");

const {
  likePlace,
  unlikePlace,
  addComment,
  delComment,
} = require("../controllers/actions.controllers");

const fileUpload = require("../middleware/file_upload");
const requireLogin = require("../middleware/auth-check");
const validatePlace = require("../validators/place.validator");

const placesRouter = express.Router();

placesRouter.get("/user/:uid", getPlacesByUser);

placesRouter.get("/:pid", getPlaceById);

placesRouter.post(
  "/",
  requireLogin,
  fileUpload.single("image"),
  validatePlace,
  createPlace
);

placesRouter.patch(
  "/:pid",
  requireLogin,
  fileUpload.single("image"),
  validatePlace,
  updatePlace
);

placesRouter.delete("/:pid", requireLogin, deletePlace);

placesRouter.post("/comments/:pid", requireLogin, addComment);
placesRouter.patch("/comments/:pid", requireLogin, delComment);

placesRouter.patch("/like/:pid", requireLogin, likePlace);
placesRouter.patch("/unlike/:pid", requireLogin, unlikePlace);

module.exports = placesRouter;
