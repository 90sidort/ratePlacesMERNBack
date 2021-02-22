const mongoose = require("mongoose");

const commentOne = {
  _id: new mongoose.Types.ObjectId(),
  text: "Test comment number one",
  created: "1970-01-01T00:00:00.001+00:00",
  postedBy: new mongoose.Types.ObjectId(),
  userName: "Test User Commentator",
};

const placeOne = {
  title: "Test Place One",
  about: "Test about string, nothing to see here.",
  type: "monument",
  description: "Test description, really not interesting.",
  image: "placeholder",
  address: "20 Test Street, Test City, Test Country",
  location: {
    lat: 53.422691,
    lng: 14.541423,
  },
  creator: "",
  likes: [],
  comments: [commentOne],
};

const placeTwo = {
  title: "Test title for place",
  about: "Test about for place",
  type: "monument",
  address: "21 Szczesliwicka, Warsaw, Poland",
  description: "Nice, quiet place in the midst of lively city.",
  creator: "",
};

const placeThree = {
  title: "Test Place Three",
  about: "Test about string, nothing to see here.",
  type: "monument",
  description: "Test description, really not interesting.",
  image: "placeholder",
  address: "21 Test Street, Test City, Test Country",
  location: {
    lat: 53.422691,
    lng: 14.541423,
  },
  creator: "",
  likes: [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
  ],
  comments: [],
};

const placeChange = {
  title: "Changed title",
  about: "Changed about",
  description: "Changed description",
  type: "other",
  address: "21 Szczesliwicka, Warsaw, Poland",
};

module.exports = { placeOne, placeTwo, placeChange, placeThree };
