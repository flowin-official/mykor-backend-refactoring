const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  country: { type: String, required: true },
  details: { type: String, required: true },

  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
