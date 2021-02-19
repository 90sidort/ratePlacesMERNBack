const request = require("supertest");

const app = require("../../app");

const Place = require("../../models/place.model");
const User = require("../../models/user.model");
const { placeOne } = require("../fixtures/places.fixture");
const { userOne } = require("../fixtures/users.fixture");

describe("Should retrieve places by user id", () => {
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
    console.log(response.body);
  });
});
