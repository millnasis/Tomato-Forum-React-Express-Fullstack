const db = require("../db");
const { ObjectId } = require("mongodb");

const dbName = "favorites";

module.exports = class FavoriteDAO {
  /**
   *
   * @param {String} userid
   * @param {String} postid
   * @returns {Promise<Boolean>}
   */
  async toggleByUserIDAndPostID(userid, postid) {
    try {
      const favorites = await db(dbName);
      const query = await favorites
        .aggregate([
          {
            $match: { userid, postid },
          },
        ])
        .toArray();
      if (query.length === 0) {
        let ret = await favorites.insertOne({
          userid,
          postid,
          foundtime: new Date(),
        });
        return ret;
      } else {
        let ret = await favorites.deleteOne({
          userid,
          postid,
        });
        return ret;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   *
   * @param {String} userid
   * @param {int} skip
   * @param {int} limit
   * @returns {Promise<Array<Object>>}
   */
  async queryByUserID(userid, skip = 0, limit = 10) {
    try {
      skip = parseInt(skip);
      limit = parseInt(limit);
      const favorites = await db(dbName);
      let ret = await favorites
        .aggregate([
          {
            $match: {
              userid,
            },
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
          {
            $sort: {
              foundtime: -1,
            },
          },
          {
            $addFields: {
              postid: {
                $convert: {
                  input: "$postid",
                  to: "objectId",
                },
              },
            },
          },
          {
            $lookup: {
              from: "posts",
              localField: "postid",
              foreignField: "_id",
              as: "post",
            },
          },
        ])
        .toArray();
      ret = ret.map((value) => {
        return { ...value, post: value.post[0] };
      });
      return ret;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   *
   * @param {String} postid
   * @param {int} skip
   * @param {int} limit
   * @returns {Promise<Array<Object>>}
   */
  async queryByPostID(postid, skip = 0, limit = 10) {
    try {
      const favorites = await db(dbName);
      skip = parseInt(skip);
      limit = parseInt(limit);
      let ret = await favorites
        .aggregate([
          {
            $match: {
              postid,
            },
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
          {
            $sort: {
              foundtime: -1,
            },
          },
        ])
        .toArray();
      return ret;
    } catch (error) {
      return false;
    }
  }

  /**
   *
   * @param {String} postid
   * @returns {Promise<int>}
   */
  async querySumByPostID(postid) {
    try {
      const favorites = await db(dbName);
      let ret = await favorites
        .aggregate([
          {
            $match: { postid },
          },
          {
            $count: "sum",
          },
        ])
        .toArray();
      return ret[0].sum;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   *
   * @param {String} userid
   * @returns {Promise<int>}
   */
  async querySumByUserID(userid) {
    try {
      const favorites = await db(dbName);
      let ret = await favorites
        .aggregate([
          {
            $match: { userid },
          },
          {
            $count: "sum",
          },
        ])
        .toArray();
      return ret[0].sum;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
};
