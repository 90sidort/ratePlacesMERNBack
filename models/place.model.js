const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  about: { type: String, required: true },
  type: { type: String },
  description: { type: String, required: false },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Place", placeSchema);
