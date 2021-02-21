const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../../app");

const Place = require("../../models/place.model");
const User = require("../../models/user.model");
const { userOne } = require("../fixtures/users.fixture");
const { placeOne, placeChange } = require("../fixtures/places.fixture");

describe("Place creation tests", () => {
  let user1;
  let place1;
  let token;

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

  test("Should be able to update place", async () => {
    const response = await request(app)
      .patch(`/api/places/${place1._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(placeChange)
      .expect(200);

    expect(response.body.place).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        title: "Changed title",
        about: "Changed about",
        type: "other",
        description: "Changed description",
        image: "placeholder",
        address: "21 Szczesliwicka, Warsaw, Poland",
        creator: user1._id.toString(),
        comments: expect.any(Array),
        likes: expect.any(Array),
        location: { lat: 52.21704, lng: 20.972199 },
      })
    );
  });

  test("Should not be able to create place with invalid address", async () => {
    placeChange.address = "test address will not work";
    const response = await request(app)
      .patch(`/api/places/${place1._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(placeChange)
      .expect(422);

    expect(response.body.message).toEqual(
      "Invalid address. Correct address format example: 10 Long Street, Big City, Super Country."
    );
  });

  test("Should not be able to create place with invalid data", async () => {
    placeChange.title = "";
    placeChange.about = "";
    placeChange.address = "";
    placeChange.type = "some";
    const response = await request(app)
      .patch(`/api/places/${place1._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(placeChange)
      .expect(422);

    expect(response.body.message).toEqual(
      "TITLE: Cannot be shorter than 1 and longer than 300 characters\nABOUT: Cannot be longer than 1000\nADDRESS: Cannot be shorter than 1 and longer than 300 characters\nTYPE: Cannot be shorter than 1 character and has to be monument /site /event /other\n"
    );
  });
});
