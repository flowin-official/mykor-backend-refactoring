const { sendContact } = require("../services/contactService");

async function postContact(req, res) {
  const { country, details } = req.body;
  try {
    await sendContact(country, details);
    res.status(201).json({
      message: "Contact message sent",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  postContact,
};
