const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  country: { type: String, required: true },
  details: { type: String, required: true },

  created: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
