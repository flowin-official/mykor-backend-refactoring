const { findAllLocations } = require("../repositories/locationRepository");

async function allLocations() {
  try {
    const locations = await findAllLocations();
    return locations;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  allLocations,
};
