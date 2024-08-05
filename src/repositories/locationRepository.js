const Location = require("../models/location");

const findLocationByCountry = async (country) => {
  try {
    const location = await Location.findOne({
      country,
    });
    return location;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findLocationByCountry,
};
