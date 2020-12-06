const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const { PLACES } = require("../mocks");
const { getLatLong } = require("../utils/location");

const getPlacesByUser = (req, res, next) => {
  console.log(req.params.uid);
  const userPlaces = [];
  PLACES.forEach((p) => {
    if (p.creator == req.params.uid) {
      userPlaces.push(p);
    }
  });

  if (userPlaces.length === 0) {
    return next(new HttpError("This user has no places added.", 404));
  } else {
    res.status(200).json({ userPlaces });
  }
};

const getPlaceById = (req, res, next) => {
  const place = PLACES.find((p) => p.id === req.params.pid);
  if (!place) {
    return next(new HttpError("This place does not exist!", 404));
  } else {
    res.status(200).json({ place });
  }
};

const createPlace = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return next(new HttpError("Invalid inputes, please check your data.", 422));
  }

  const { title, description, address, creator } = req.body;
  const coordinates = await getLatLong(address);
  if (coordinates === "Error") {
    return next(new HttpError("Invalid address, please check your data.", 422));
  }
  const newPlace = {
    id: uuidv4(),
    title,
    description,
    address,
    creator,
    location: coordinates,
  };
  PLACES.push(newPlace);
  res.status(201).json(newPlace);
};

const updatePlace = (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return next(new HttpError("Invalid inputes, please check your data.", 422));
  }

  const { title, description } = req.body;
  const updatedPlace = { ...PLACES.find((p) => p.id === req.params.pid) };
  const placeIndex = PLACES.findIndex((p) => p.id === req.params.pid);
  updatedPlace.title = title;
  updatedPlace.description = description;

  PLACES[placeIndex] = updatedPlace;
  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const place = PLACES.findIndex((p) => p.id == req.params.pid);
  if (place === -1) {
    return next(new HttpError("This place does not exist!", 404));
  } else {
    const deletedPlace = PLACES[place];
    PLACES.splice(place, 1);
    res.status(200).json(deletedPlace);
  }
};

module.exports = {
  getPlaceById,
  getPlacesByUser,
  createPlace,
  deletePlace,
  updatePlace,
};
