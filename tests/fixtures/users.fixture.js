const mongoose = require("mongoose");

const userOne = {
  name: "Test User",
  email: "SpecialTest@test.com",
  image: "placeholder",
  password: "testest2",
  places: [],
  following: [],
  followers: [],
  about: "I am a test user m8!",
};

const userTwo = {
  name: "Tester Two",
  email: "testerTwo@test.com",
  image: "placeholder",
  password: "testest1",
  places: [],
  following: [],
  followers: [],
  about: "I am a test user number two m8!",
};

const userThree = {
  name: "Tester Three",
  email: "testerThree@test.com",
  image: "placeholder",
  password: "testest3",
  places: [],
  following: [],
  followers: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
  about: "I am a test user number three m8!",
};

const longString = `This is a changed about section.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.
But it is way too long.`;

module.exports = { userOne, userTwo, userThree, longString };
