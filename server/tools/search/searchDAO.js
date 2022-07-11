const db = require("../db");
const { ObjectId } = require("mongodb");

const dbName = "search";

module.exports = class SearchDAO {
  /**
   *
   * @param {Array<String>} words
   */
  async recordSearchWords(words) {
    try {
      const search = await db(dbName);
      words.forEach(async (word) => {
        const query = await search.find({ word }).toArray();
        if (query.length === 0) {
          await search.insert({ word, count: 1 });
        } else {
          await search.updateOne({ word }, { $inc: { count: 1 } });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getHotSearchKeyword(num = 5) {
    try {
      const search = await db(dbName);
      const ret = await search
        .aggregate([
          {
            $sort: {
              count: -1,
            },
          },
          {
            $limit: num,
          },
        ])
        .toArray();
      return ret;
    } catch (error) {}
  }
};
