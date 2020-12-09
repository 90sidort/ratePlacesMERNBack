const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

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
    return next(new HttpError("Invalid inputes, please check your data.", 422));
  }
  const { title, description, address, creator, image } = await req.body;
  const coordinates = await getLatLong(address);
  if (coordinates === "Error") {
    return next(new HttpError("Invalid address, please check your data.", 422));
  }
  const createdPlace = new Place({
    title,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg",
    description,
    address,
    creator,
    location: coordinates,
  });

  try {
    const user = await User.findById(creator);
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
    return next(new HttpError("Invalid inputs, please check your data.", 422));
  }

  const { title, description } = await req.body;
  try {
    const place = await Place.findById({ _id: req.params.pid });
    if (!place) {
      return next(new HttpError("Place with this id does not exist.", 404));
    } else {
      place.title = title;
      place.description = description;
      await place.save();
      return res.status(200).json({ place: place.toObject({ getters: true }) });
    }
  } catch (e) {
    return next(new HttpError("Server error.", 500));
  }
};

const deletePlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.pid).populate("creator");
    if (!place) {
      return next(new HttpError("No places with this id exist.", 500));
    } else {
      const session = await mongoose.startSession();
      session.startTransaction();
      await place.remove({ session });
      place.creator.places.pull(place);
      await place.creator.save({ session });
      await session.commitTransaction();
      return res.status(200).json({ message: "Place has been deleted." });
    }
  } catch (e) {
    return next(new HttpError("Server error.", 500));
  }
};

module.exports = {
  getPlaceById,
  getPlacesByUser,
  createPlace,
  deletePlace,
  updatePlace,
};
