const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../../app");

const Place = require("../../models/place.model");
const User = require("../../models/user.model");
const { placeOne, placeThree } = require("../fixtures/places.fixture");
const { userOne } = require("../fixtures/users.fixture");

describe("Users retrieve tests", () => {
  let user1;
  let place1;

  beforeAll(async () => {
    await Place.deleteMany();
    await User.deleteMany();
    user1 = await new User(userOne).save();
    placeOne.creator = user1._id;
    place1 = await new Place(placeOne).save();
  });

  afterAll(async () => {
    await Place.deleteMany();
    await User.deleteMany();
  });

  test("Should retrieve places when querying with valid user id", async () => {
    const response = await request(app)
      .get(`/api/places/user/${user1._id}`)
      .expect(200);
    expect(response.body.places.length).toEqual(1);
    expect(response.body.places[0]).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        title: "Test Place One",
        about: "Test about string, nothing to see here.",
        type: "monument",
        description: "Test description, really not interesting.",
        image: "placeholder",
        address: "20 Test Street, Test City, Test Country",
        creator: expect.any(String),
        comments: expect.any(Array),
        likes: expect.any(Array),
        location: { lat: 53.422691, lng: 14.541423 },
      })
    );
  });

  test("Should be able to retrieve place by its id", async () => {
    const response = await request(app)
      .get(`/api/places/${place1._id}`)
      .expect(200);

    expect(response.body.place).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        title: "Test Place One",
        about: "Test about string, nothing to see here.",
        type: "monument",
        description: "Test description, really not interesting.",
        image: "placeholder",
        address: "20 Test Street, Test City, Test Country",
        creator: expect.any(String),
        comments: expect.any(Array),
        likes: expect.any(Array),
        location: { lat: 53.422691, lng: 14.541423 },
      })
    );
  });

  test("Should message about nonexisting place", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/api/places/${fakeId}`)
      .expect(404);

    expect(response.body.message).toEqual("This place does not exist!");
  });

  test("Should sort places by number of likes", async () => {
    placeThree.creator = user1._id;
    await new Place(placeThree).save();
    const response = await request(app).get(`/api/places/popular/`).expect(200);

    expect(response.body.places[0].title).toEqual("Test Place Three");
  });
});
