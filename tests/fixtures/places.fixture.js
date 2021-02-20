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

module.exports = { placeOne };
