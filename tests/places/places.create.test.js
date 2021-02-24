const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../../app");

const Place = require("../../models/place.model");
const User = require("../../models/user.model");
const { userOne } = require("../fixtures/users.fixture");
const { placeTwo } = require("../fixtures/places.fixture");

describe("Place creation tests", () => {
  let user1;
  let token;

  beforeAll(async () => {
    await Place.deleteMany();
    await User.deleteMany();
    user1 = await new User(userOne).save();
    token = jwt.sign(
      { userId: user1.id, email: user1.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    placeTwo.creator = user1._id;
  });
  afterAll(async () => {
    await Place.deleteMany();
    await User.deleteMany();
  });

  test("Should be able to create place", async () => {
    const response = await request(app)
      .post(`/api/places`)
      .set("Authorization", `Bearer ${token}`)
      .send(placeTwo)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        title: "Test title for place",
        about: "Test about for place",
        type: "monument",
        description: "Nice, quiet place in the midst of lively city.",
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
    placeTwo.address = "test address will not work";
    const response = await request(app)
      .post(`/api/places`)
      .set("Authorization", `Bearer ${token}`)
      .send(placeTwo)
      .expect(422);

    expect(response.body.message).toEqual(
      "Invalid address. Correct address format example: 10 Long Street, Big City, Super Country."
    );
  });

  test("Should not be able to create place with invalid data", async () => {
    placeTwo.title = "";
    placeTwo.about = "";
    placeTwo.address = "";
    placeTwo.type = "some";
    const response = await request(app)
      .post(`/api/places`)
      .set("Authorization", `Bearer ${token}`)
      .send(placeTwo)
      .expect(422);

    expect(response.body.message).toEqual(
      "TITLE: Cannot be shorter than 1 and longer than 300 characters\nABOUT: Cannot be longer than 1000\nADDRESS: Cannot be shorter than 1 and longer than 300 characters\nTYPE: Cannot be shorter than 1 character and has to be monument /site /event /other\n"
    );
  });
});
