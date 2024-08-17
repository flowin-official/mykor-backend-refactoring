const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  country: { type: String, required: true },
  details: { type: String, default: null },
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
