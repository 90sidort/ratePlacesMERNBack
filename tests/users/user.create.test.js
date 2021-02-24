const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = require("../../app");

const User = require("../../models/user.model");
const { userOne, userTwo } = require("../fixtures/users.fixture");

describe("User create tests", () => {
  let user1;
  let user2;
  let token2;

  beforeAll(async () => {
    await User.deleteMany();
    // user1 = await new User(userOne).save();
    user2 = await new User(userTwo).save();
    // token2 = jwt.sign(
    //   { userId: user2.id, email: user2.email },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1h" }
    // );
  });

  afterAll(async () => {
    await User.deleteMany();
  });

  test("Should be able to create user", async () => {
    const response = await request(app)
      .post(`/api/users/signup`)
      .send(userOne)
      .expect(201);

    expect(response.body).toEqual({
      userId: expect.any(String),
      email: userOne.email,
      token: expect.any(String),
    });
  });

  test("Should not be able to create user with already existing email", async () => {
    const response = await request(app)
      .post(`/api/users/signup`)
      .send(userTwo)
      .expect(500);

    expect(response.body.message).toEqual("User already exists.");
  });

  test("Should not be able to create user with invalid data", async () => {
    const response = await request(app)
      .post(`/api/users/signup`)
      .send({
        name: "",
        email: "@test.com",
        password: "o",
      })
      .expect(422);

    expect(response.body.message).toEqual(
      "NAME: Requires at least 1 chars and max 100 chars\nEMAIL: Requires valid email\nPASSWORD: Requires at least 6 chars and max 16 chars\n"
    );
  });
});
