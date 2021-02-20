const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../../app");

const Place = require("../../models/place.model");
const User = require("../../models/user.model");
const { placeOne, placeTwo } = require("../fixtures/places.fixture");
const { userOne } = require("../fixtures/users.fixture");

describe("Place deletion tests", () => {
  let user1;
  let place1;
  let token;
  let place2;

  beforeAll(async () => {
    await Place.deleteMany();
    await User.deleteMany();
    user1 = await new User(userOne).save();
    placeOne.creator = user1._id;
    place1 = await new Place(placeOne).save();
    token = jwt.sign(
      { userId: user1.id, email: user1.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });
  afterAll(async () => {
    await Place.deleteMany();
    await User.deleteMany();
  });

  test("Should delete existing place", async () => {
    const response = await request(app)
      .delete(`/api/places/${place1._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toEqual("Place has been deleted.");
  });

  test("Should not be able to delete nonexisting place", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/places/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(500);

    expect(response.body.message).toEqual("Server error.");
  });

  test("Should not be able to delete place create by other user", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    place1.creator = fakeId;
    const response = await request(app)
      .delete(`/api/places/${place1._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(500);

    expect(response.body.message).toEqual("Server error.");
  });
});
