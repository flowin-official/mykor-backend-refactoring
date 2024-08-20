const { findAllTags } = require("../repositories/tagRepository");

async function allTags() {
  try {
    const tags = await findAllTags();
    return tags;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  allTags,
};
