const Tag = require("../models/tags");

const findAllTags = async () => {
  try {
    const tags = await Tag.find();
    return tags;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findAllTags,
};
