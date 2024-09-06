const { createContact } = require("../repositories/contactRepository");

async function sendContact(country, details) {
  try {
    await createContact(country, details);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  sendContact,
};
