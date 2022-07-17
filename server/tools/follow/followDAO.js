const db = require("../db");
const { ObjectId } = require("mongodb");

const dbName = "follows";

class followDAO {
  async followByUserFromAndUserTo(userFrom, userTo) {
    try {
      const follows = await db(dbName);
      const query = await follows.find({ userFrom, userTo }).toArray();
      if (query.length > 0) {
        return false;
      }

      const ret = await follows.insertOne({
        userFrom,
        userTo,
        date: new Date(),
      });
      return ret;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async unfollowByUserFromAndUserTo(userFrom, userTo) {
    try {
      const follows = await db(dbName);
      const ret = await follows.deleteOne({ userFrom, userTo });
      return ret;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * 我关注的
   * @param {String} ID
   * @returns
   */
  async queryUserFollowWhoByUserID(ID) {
    try {
      const follows = await db(dbName);
      const ret = await follows
        .aggregate([
          {
            $match: {
              userFrom: ID,
            },
          },
          {
            $sort: {
              date: -1,
            },
          },
          {
            $addFields: {
              userTo: {
                $convert: {
                  input: "$userTo",
                  to: "objectId",
                },
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userTo",
              foreignField: "_id",
              as: "userTo",
            },
          },
        ])
        .toArray();
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * 关注我的
   * @param {String} ID
   */
  async queryWhoFollowUserByUserID(ID) {
    try {
      const follows = await db(dbName);
      const ret = await follows
        .aggregate([
          {
            $match: {
              userTo: ID,
            },
          },
          {
            $sort: {
              date: -1,
            },
          },
          {
            $addFields: {
              userFrom: {
                $convert: {
                  input: "$userFrom",
                  to: "objectId",
                },
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userFrom",
              foreignField: "_id",
              as: "userFrom",
            },
          },
        ])
        .toArray();
      return ret;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async queryFollowIsExist(userFrom, userTo) {
    try {
      const follows = await db(dbName);
      const ret = await follows
        .find({
          userFrom,
          userTo,
        })
        .toArray();
      if (ret.length === 0) {
        return {
          status: "exist",
        };
      } else {
        return {
          status: "null",
        };
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

module.exports = followDAO;
