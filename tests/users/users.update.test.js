const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = require("../../app");

const User = require("../../models/user.model");
const { userOne, userTwo, longString } = require("../fixtures/users.fixture");

describe("User update tests", () => {
  let user1;
  let user2;
  let token2;

  beforeAll(async () => {
    await User.deleteMany();
    user1 = await new User(userOne).save();
    user2 = await new User(userTwo).save();
    token2 = jwt.sign(
      { userId: user2.id, email: user2.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  afterAll(async () => {
    await User.deleteMany();
  });

  test("Should be able to follow user", async () => {
    const response = await request(app)
      .put(`/api/users/follow/${user1._id}`)
      .set("Authorization", `Bearer ${token2}`)
      .expect(201);

    expect(response.body.follow.length).toEqual(1);
    expect(response.body.followed).toEqual(1);
  });

  test("Should not be able to follow user that you are already following", async () => {
    const response = await request(app)
      .put(`/api/users/follow/${user1._id}`)
      .set("Authorization", `Bearer ${token2}`)
      .expect(400);

    expect(response.body.message).toEqual("Already following this user.");
  });

  test("Should be able to unfollow user", async () => {
    const response = await request(app)
      .put(`/api/users/unfollow/${user1._id}`)
      .set("Authorization", `Bearer ${token2}`)
      .expect(201);

    expect(response.body.follow.length).toEqual(0);
    expect(response.body.followed).toEqual(0);
  });

  test("Should notify when user/s doesn't/don't exist", async () => {
    const response = await request(app)
      .put(`/api/users/follow/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${token2}`)
      .expect(400);

    expect(response.body.message).toEqual("Unable to find users.");
  });

  test("Should not be able to follow oneself", async () => {
    const response = await request(app)
      .put(`/api/users/follow/${user2._id}`)
      .set("Authorization", `Bearer ${token2}`)
      .expect(400);

    expect(response.body.message).toEqual("Cannot follow yourself.");
  });

  test("Should be able to update user details", async () => {
    const response = await request(app)
      .patch(`/api/users/${user2._id}`)
      .send({
        name: "ChangedNameUser",
        email: "changedTest@test.com",
        about: "This is a changed about section.",
      })
      .set("Authorization", `Bearer ${token2}`)
      .expect(200);
    expect(response.body.user).toEqual({
      about: "This is a changed about section.",
      name: "ChangedNameUser",
      email: "changedTest@test.com",
      image: "placeholder",
      id: expect.any(String),
      _id: expect.any(String),
    });
  });

  test("Should notify if user does not exist (update)", async () => {
    const response = await request(app)
      .patch(`/api/users/${new mongoose.Types.ObjectId()}`)
      .send({
        name: "ChangedNameUser",
        email: "changedTest@test.com",
        about: "This is a changed about section.",
      })
      .set("Authorization", `Bearer ${token2}`)
      .expect(404);
    expect(response.body.message).toEqual("User with this id does not exist.");
  });

  test("Should not be able to update other users", async () => {
    const response = await request(app)
      .patch(`/api/users/${user1._id}`)
      .send({
        name: "ChangedNameUser",
        email: "changedTest@test.com",
        about: "This is a changed about section.",
      })
      .set("Authorization", `Bearer ${token2}`)
      .expect(401);
    expect(response.body.message).toEqual("Authorization error.");
  });

  test("Should be impossible to update user details with invalid data", async () => {
    const response = await request(app)
      .patch(`/api/users/${user2._id}`)
      .send({
        name: "",
        email: "changedTest",
        about: longString,
      })
      .set("Authorization", `Bearer ${token2}`)
      .expect(422);

    expect(response.body.message).toEqual(
      "NAME: Requires at least 1 chars and max 100 chars\nEMAIL: Requires valid email\nABOUT: 1000 chars max!\n"
    );
  });
});
