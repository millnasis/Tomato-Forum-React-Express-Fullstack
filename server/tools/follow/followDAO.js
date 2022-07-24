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
  async queryUserFollowWhoByUserID(ID, skip, limit) {
    try {
      skip = parseInt(skip);
      limit = parseInt(limit);
      const follows = await db(dbName);
      const array = await follows
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
            $skip: skip,
          },
          {
            $limit: limit,
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
              as: "showInfo",
            },
          },
          {
            $unwind: "$showInfo",
          },
          {
            $addFields: {
              "showInfo._id": {
                $convert: {
                  input: "$showInfo._id",
                  to: "string",
                },
              },
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "showInfo._id",
              foreignField: "userTo",
              as: "showInfo.followCount",
            },
          },
          {
            $addFields: {
              "showInfo.followCount": {
                $size: "$showInfo.followCount",
              },
            },
          },
        ])
        .toArray();
      const sum = await follows
        .aggregate([
          {
            $match: {
              userFrom: ID,
            },
          },
          {
            $count: "sum",
          },
        ])
        .toArray();
      return {
        array,
        sum: sum.length === 0 ? 0 : sum[0].sum,
      };
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * 关注我的
   * @param {String} ID
   */
  async queryWhoFollowUserByUserID(ID, skip, limit) {
    try {
      skip = parseInt(skip);
      limit = parseInt(limit);
      const follows = await db(dbName);
      const array = await follows
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
            $skip: skip,
          },
          {
            $limit: limit,
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
              as: "showInfo",
            },
          },
          {
            $unwind: "$showInfo",
          },
          {
            $addFields: {
              "showInfo._id": {
                $convert: {
                  input: "$showInfo._id",
                  to: "string",
                },
              },
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "showInfo._id",
              foreignField: "userTo",
              as: "showInfo.followCount",
            },
          },
          {
            $addFields: {
              "showInfo.followCount": {
                $size: "$showInfo.followCount",
              },
            },
          },
        ])
        .toArray();
      const sum = await follows
        .aggregate([
          {
            $match: {
              userTo: ID,
            },
          },
          {
            $count: "sum",
          },
        ])
        .toArray();
      return {
        array,
        sum: sum.length === 0 ? 0 : sum[0].sum,
      };
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
      if (ret.length !== 0) {
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

  async queryFollowSumByUserID(ID) {
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
            $count: "sum",
          },
        ])
        .toArray();
      if (ret.length !== 0) {
        return ret[0].sum;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

module.exports = followDAO;
