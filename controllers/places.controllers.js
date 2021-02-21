const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const fs = require("fs");

const HttpError = require("../models/http-error");
const { getLatLong } = require("../utils/location");
const Place = require("../models/place.model");
const User = require("../models/user.model");

const getPlacesByUser = async (req, res, next) => {
  try {
    const places = await Place.find({ creator: req.params.uid });
    return res.status(200).json({
      places: places.map((place) => place.toObject({ getters: true })),
    });
  } catch (e) {
    return next(new HttpError("Server error.", 500));
  }
};

const getPlaceById = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.pid);
    if (!place) {
      return next(new HttpError("This place does not exist!", 404));
    } else {
      return res.status(200).json({ place: place.toObject({ getters: true }) });
    }
  } catch (e) {
    return next(new HttpError("Server error.", 500));
  }
};

const createPlace = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    let errorMessage = "";
    await errors.forEach((e) => {
      errorMessage = errorMessage + `${e.param.toUpperCase()}: ${e.msg}` + "\n";
    });
    return next(new HttpError(errorMessage, 422));
  }
  const { title, about, address, description, type } = await req.body;
  const coordinates = await getLatLong(address);
  if (coordinates === "Error") {
    return next(
      new HttpError(
        "Invalid address. Correct address format example: 10 Long Street, Big City, Super Country.",
        422
      )
    );
  }
  const createdPlace = new Place({
    title,
    image: req.file ? req.file.path : "placeholder",
    about,
    type,
    address,
    description,
    creator: req.userData.userId,
    location: coordinates,
  });

  try {
    const user = await User.findById(req.userData.userId);
    if (!user) {
      return next(new HttpError("Unable to find user.", 500));
    } else {
      const session = await mongoose.startSession();
      session.startTransaction();
      await createdPlace.save({ session });
      user.places.push(createdPlace);
      await user.save({ session });
      await session.commitTransaction();
    }
  } catch (e) {
    return next(new HttpError("Unable to save.", 500));
  }
  res.status(201).json(createdPlace);
};

const updatePlace = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    let errorMessage = "";
    await errors.forEach((e) => {
      errorMessage = errorMessage + `${e.param.toUpperCase()}: ${e.msg}` + "\n";
    });
    return next(new HttpError(errorMessage, 422));
  }

  const { title, about, description, type, address } = await req.body;
  try {
    const place = await Place.findById({ _id: req.params.pid });
    if (!place) {
      return next(new HttpError("Place with this id does not exist.", 404));
    } else {
      let coordinates = place.location;
      if (address !== place.address) {
        coordinates = await getLatLong(address);
        if (coordinates === "Error") {
          return next(
            new HttpError(
              "Invalid address. Correct address format example: 10 Long Street, Big City, Super Country.",
              422
            )
          );
        }
      }

      if (place.creator.toString() !== req.userData.userId) {
        return next(new HttpError("Authorization error.", 401));
      }
      place.title = title;
      place.location = coordinates;
      place.type = type;
      place.address = address;
      place.description = description;
      place.about = about;
      place.image = place.image = req.file ? req.file.path : place.image;
      await place.save();
      return res.status(200).json({ place: place.toObject({ getters: true }) });
    }
  } catch (e) {
    return next(new HttpError("Server error.", 500));
  }
};

const deletePlace = async (req, res, next) => {
  let imagePath;
  try {
    const place = await Place.findById(req.params.pid).populate("creator");
    imagePath = place.image;
    if (!place) {
      return next(new HttpError("No places with this id exist.", 500));
    } else {
      if (place.creator.id !== req.userData.userId) {
        return next(new HttpError("Authorization error.", 401));
      }
      const session = await mongoose.startSession();
      session.startTransaction();
      await place.remove({ session });
      place.creator.places.pull(place);
      await place.creator.save({ session });
      await session.commitTransaction();
    }
  } catch (e) {
    return next(new HttpError("Server error.", 500));
  }
  if (imagePath !== "placeholder") {
    fs.unlink(imagePath, (error) => {
      console.log(error);
    });
  }
  return res.status(200).json({ message: "Place has been deleted." });
};

module.exports = {
  getPlaceById,
  getPlacesByUser,
  createPlace,
  deletePlace,
  updatePlace,
};
