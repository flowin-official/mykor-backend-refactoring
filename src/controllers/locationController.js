const { allLocations } = require("../services/locationService");

async function getLocations(req, res) {
  try {
    const locations = await allLocations();
    res.status(200).json({
      message: "Locations found",
      locations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getLocations,
};
