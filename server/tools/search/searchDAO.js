const db = require("../db");
const { ObjectId } = require("mongodb");
const constant = require("../constant");
const { totalHotSearchTypeState, totalSortSelectionState } = constant;

const dbName = "search";

module.exports = class SearchDAO {
  async adminNormalDelete(id) {
    try {
      id = ObjectId(id);
      const search = await db(dbName);
      const ret = await search.deleteOne({ _id: id });
      return ret;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async adminNormalAdd(obj) {
    try {
      const search = await db(dbName);
      const query = await search.find({ word: obj.word }).toArray();
      if (query.length !== 0) {
        return "exist";
      }
      const ret = await search.insertOne({
        ...obj,
        count: +obj.count,
        type: totalHotSearchTypeState.NORMAL,
      });
      return ret;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async adminNormalUpdate(id, obj) {
    try {
      id = ObjectId(id);
      delete obj._id;
      obj.count = parseInt(obj.count);
      const search = await db(dbName);
      const ret = await search.updateOne(
        { _id: id },
        {
          $set: {
            ...obj,
          },
        }
      );
      return ret;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async adminNormalQuery(query) {
    try {
      let { current, pageSize, word, sort } = query;
      const search = await db(dbName);
      const aggregate = [];
      const match = { type: totalHotSearchTypeState.NORMAL };
      if (word) {
        match["word"] = new RegExp(word);
      }
      aggregate.push(
        { $match: match },
        { $sort: { count: sort === totalSortSelectionState.ASC ? 1 : -1 } }
      );
      if (current) {
        current = parseInt(current);
        pageSize = pageSize ? parseInt(pageSize) : 10;
        aggregate.push(
          { $skip: (current - 1) * pageSize },
          { $limit: pageSize }
        );
      } else {
        (current = 1), (pageSize = 10);
      }

      const ret = await search.aggregate(aggregate).toArray();
      const sum = await search
        .aggregate([
          {
            $match: match,
          },
          {
            $count: "sum",
          },
        ])
        .toArray();
      return {
        arr: ret,
        pagination: {
          current,
          pageSize,
          total: sum.length === 0 ? 0 : sum[0].sum,
        },
      };
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async adminControlQuery() {
    try {
      const search = await db(dbName);
      let ret = await search
        .find({ type: totalHotSearchTypeState.CONTROL })
        .toArray();
      if (ret.length === 0) {
        await search.insertOne({
          words: [],
          type: totalHotSearchTypeState.CONTROL,
        });
        ret = [];
      } else {
        ret = ret[0].words;
      }
      return ret;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
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
          await search.insert({
            word,
            count: 1,
            type: totalHotSearchTypeState.NORMAL,
          });
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
      const normal = await search
        .aggregate([
          {
            $match: {
              type: totalHotSearchTypeState.NORMAL,
            },
          },
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
      let control = await search
        .find({ type: totalHotSearchTypeState.CONTROL })
        .toArray();
      if (control.length === 0) {
        await search.insertOne({
          words: [],
          type: totalHotSearchTypeState.CONTROL,
        });
        control = [];
      } else {
        control = control[0].words;
      }
      return {
        control,
        normal,
      };
    } catch (error) {
      console.error(error);
      return false;
    }
  }
};
