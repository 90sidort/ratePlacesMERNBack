const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../../app");

const Place = require("../../models/place.model");
const User = require("../../models/user.model");
const { userOne } = require("../fixtures/users.fixture");
const { placeOne, placeChange } = require("../fixtures/places.fixture");

describe("Place update tests", () => {
  let user1;
  let place1;
  let comment1;
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

  test("Should be able to give like to a place", async () => {
    const response = await request(app)
      .patch(`/api/places/like/${place1._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(200);

    expect(response.body.place.likes[0].toString()).toEqual(
      user1._id.toString()
    );
  });

  test("Should be able to unlike to a place", async () => {
    const response = await request(app)
      .patch(`/api/places/unlike/${place1._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(200);

    expect(response.body.place.likes.length).toEqual(0);
  });

  test("Should be able to add comment to a place", async () => {
    const response = await request(app)
      .post(`/api/places/comments/${place1._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "This is a test comment",
        userId: user1._id,
        userName: user1.name,
      })
      .expect(200);
    comment1 = response.body.place.comments[1]._id;
    expect(response.body.place.comments[1].text).toEqual(
      "This is a test comment"
    );
  });

  test("Should be able to remove comment from a place", async () => {
    const response = await request(app)
      .patch(`/api/places/comments/${place1._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ cid: comment1 })
      .expect(200);

    console.log(response.body.place);
    expect(response.body.place.comments.length).toEqual(1);
  });

  test("Should not be able to update place with invalid address", async () => {
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

  test("Should not be able to update place with invalid data", async () => {
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
