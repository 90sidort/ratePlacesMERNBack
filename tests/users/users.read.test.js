const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../../app");

const User = require("../../models/user.model");
const { userOne, userTwo } = require("../fixtures/users.fixture");

describe("User read tests", () => {
  let user1;
  let user2;

  beforeAll(async () => {
    await User.deleteMany();
    user1 = await new User(userOne).save();
    user2 = await new User(userTwo).save();
  });

  afterAll(async () => {
    await User.deleteMany();
  });

  test("Should be able to get user list", async () => {
    const response = await request(app).get(`/api/users`).expect(200);

    expect(response.body.users.length).toEqual(2);
  });

  test("Should be able to get specific user", async () => {
    const response = await request(app)
      .get(`/api/users/${user1._id}`)
      .expect(200);
    expect(response.body.user.name).toEqual("Test User");
  });

  test("Should send message when user id does not match", async () => {
    const response = await request(app)
      .get(`/api/users/${new mongoose.Types.ObjectId()}`)
      .expect(404);
    expect(response.body.message).toEqual("User with this id does not exist.");
  });

  test("Should be able to get followers and followings", async () => {
    const response = await request(app)
      .patch(`/api/users/details/get`)
      .send({
        usersIdsFollowed: user1._id,
        userIdsFollowers: user1._id,
      })
      .expect(200);

    expect(response.body.followed[0]).toEqual({
      _id: expect.any(String),
      name: "Test User",
      image: "placeholder",
    });

    expect(response.body.followers[0]).toEqual({
      _id: expect.any(String),
      name: "Test User",
      image: "placeholder",
    });
  });
});
