const express = require("express");
const { check } = require("express-validator");

const {
  getPlaceById,
  getPlacesByUser,
  createPlace,
  deletePlace,
  updatePlace,
  likePlace,
  unlikePlace,
  addComment,
} = require("../controllers/places.controllers");

const fileUpload = require("../middleware/file_upload");
const requireLogin = require("../middleware/auth-check");

const placesRouter = express.Router();

placesRouter.get("/user/:uid", getPlacesByUser);

placesRouter.get("/:pid", getPlaceById);

placesRouter.post(
  "/",
  requireLogin,
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("about").isLength(5),
    check("address").not().isEmpty(),
  ],
  createPlace
);

placesRouter.post("/comments/:pid", requireLogin, addComment);

placesRouter.patch(
  "/:pid",
  requireLogin,
  fileUpload.single("image"),
  [check("title").not().isEmpty(), check("about").isLength(5)],
  updatePlace
);

placesRouter.patch("/like/:pid", requireLogin, likePlace);
placesRouter.patch("/unlike/:pid", requireLogin, unlikePlace);

placesRouter.delete("/:pid", requireLogin, deletePlace);

module.exports = placesRouter;
