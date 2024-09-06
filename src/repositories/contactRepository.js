const Contact = require("../models/contact");

const createContact = async (country, details) => {
  try {
    const contact = await Contact.create({
      country,
      details,
    });
    return contact;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createContact,
};
