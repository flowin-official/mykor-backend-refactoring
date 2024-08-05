const Location = require("../models/location");

const findLocationByCountryDetails = async (country, details) => {
  try {
    const location = await Location.findOne({
      country,
      details,
    });
    return location;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findLocationByCountryDetails,
};
