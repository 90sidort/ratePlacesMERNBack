const mongoose = require("mongoose");
const mongooseValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
  following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  about: {
    type: String,
    default: "Hi, maybe you'll tell us a bit about yourself",
  },
  archived: { type: Boolean, required: true, default: false },
});

userSchema.plugin(mongooseValidator);

module.exports = mongoose.model("User", userSchema);
