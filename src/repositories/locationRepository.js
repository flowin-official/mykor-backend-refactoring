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

// 추후에 details 지원 예정
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
  findLocationByCountry,
  findLocationByCountryDetails,
};
