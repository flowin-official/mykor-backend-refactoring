const Tag = require("../models/tag");

const findAllTags = async () => {
  try {
    const tags = await Tag.find();
    return tags;
  } catch (error) {
    throw error;
  }
};

const findTagById = async (tagId) => {
  try {
    const tag = await Tag.findById(tagId);
    return tag;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findAllTags,
  findTagById,
};
