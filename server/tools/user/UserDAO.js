const db = require("../db");
const PermitDAO = require("./PermitDAO");
const UserVO = require("./UserVO");
const { ObjectId } = require("mongodb");
const MessageDAO = require("../message/messageDAO");
const constant = require("../constant");
const getRegexByKeyword = require("../getRegexByKeyword");

const { totalSortMode } = constant;

const dbName = "users";
const default_head_picture = "/public/logo.png";

module.exports = class UserDAO {
  async queryByID(ID) {
    try {
      const users = await db(dbName);
      const ret = await users.find({ _id: ObjectId(ID) }).toArray();
      const messageDAO = new MessageDAO();
      const msgNum = await messageDAO.queryUnreadMessageSumByUserID(ret[0]._id);

      if (ret.length === 0) {
        return false;
      }

      const userVo = new UserVO(ret[0], msgNum);
      return userVo;
    } catch (error) {
      console.error(error);
    }
  }

  async queryAll() {
    try {
      const users = await db(dbName);
      let ret = await users.find().toArray();

      return ret.map((value) => {
        return new UserVO(value);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async queryIDByUserName(username) {
    try {
      const users = await db(dbName);
      const ret = await users.find({ username }).toArray();
      if (ret.length === 0) {
        return false;
      }
      return ret[0]._id;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async queryByUserName(userName) {
    try {
      const users = await db(dbName);
      const ret = await users.find({ username: userName }).toArray();
      const messageDAO = new MessageDAO();
      const msgNum = await messageDAO.queryUnreadMessageSumByUserID(ret[0]._id);

      if (ret.length === 0) {
        return false;
      }

      return new UserVO(ret[0], msgNum);
    } catch (error) {
      console.error(error);
    }
  }

  async queryByUserPermit(userid, password) {
    try {
      const permit = new PermitDAO();
      let condition = await permit.queryByUserIDAndPassWord(userid, password);
      if (!condition) {
        return false;
      }
      const users = await db(dbName);
      let ret = await users.find({ _id: ObjectId(userid) }).toArray();

      if (ret.length === 0) {
        return false;
      }

      return new UserVO(ret[0]);
    } catch (error) {
      console.error(error);
    }
  }

  async createUserByUsernameAndPassword(username, password) {
    try {
      const permit = new PermitDAO();
      const users = await db(dbName);
      let condition = await users.find({ username }).toArray();
      if (condition.length !== 0) {
        return false;
      }

      const insertRet = await users.insertOne({
        username: username,
        head_picture: default_head_picture,
        words: "编辑个性签名",
        age: 0,
        foundtime: new Date(),
        likeCount: 0,
        email: null,
        sex: null,
      });

      const ret = await permit.createUserByUserIDAndPassword(
        insertRet.insertedId,
        password
      );

      if (!ret) {
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   *
   * @param {Object}
   */
  async updateUserByIDAndUserInfo(ID, userInfo) {
    try {
      const users = await db(dbName);

      await users.updateOne(
        { _id: ObjectId(ID) },
        {
          $set: {
            head_picture: userInfo.head_picture,
            words: userInfo.words,
            sex: userInfo.sex,
            email: userInfo.email,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUserByID(ID) {
    try {
      const users = await db(dbName);
      const permit = new PermitDAO();
      let ret = await this.queryByID(ID);
      await permit.deleteUserByUsernameAndPassword(ret.username);
      await users.deleteOne({ _id: ObjectId(ID) });
    } catch (error) {}
  }

  async updateLikeCountByUserID(ID, num) {
    try {
      if (typeof ID === "string") {
        ID = ObjectId(ID);
      }
      num = parseInt(num);
      const users = await db(dbName);
      const ret = await users.updateOne(
        { _id: ID },
        {
          $inc: {
            likeCount: num,
          },
        }
      );
      return ret;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async search(keyword, sortMode, skip, limit) {
    skip = parseInt(skip);
    limit = parseInt(limit);
    const regex = getRegexByKeyword(keyword);
    try {
      const users = await db(dbName);
      let ret = {};
      let sum = await users
        .aggregate([
          {
            $match: {
              username: regex,
            },
          },
          {
            $count: "count",
          },
        ])
        .toArray();
      ret.sum = sum.length !== 0 ? sum[0].count : 0;
      switch (sortMode) {
        case totalSortMode.NEW: {
          ret.arr = await users
            .aggregate([
              {
                $match: {
                  username: regex,
                },
              },
              {
                $addFields: {
                  _id: {
                    $convert: {
                      input: "$_id",
                      to: "string",
                    },
                  },
                },
              },
              {
                $lookup: {
                  from: "follows",
                  localField: "_id",
                  foreignField: "userTo",
                  as: "followCount",
                },
              },
              {
                $addFields: {
                  followCount: {
                    $size: "$followCount",
                  },
                },
              },
              {
                $sort: {
                  foundtime: -1,
                },
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
              },
            ])
            .toArray();
          break;
        }
        case totalSortMode.LIKE: {
          ret.arr = await users
            .aggregate([
              {
                $match: {
                  username: regex,
                },
              },
              {
                $addFields: {
                  _id: {
                    $convert: {
                      input: "$_id",
                      to: "string",
                    },
                  },
                },
              },
              {
                $lookup: {
                  from: "follows",
                  localField: "_id",
                  foreignField: "userTo",
                  as: "followCount",
                },
              },
              {
                $addFields: {
                  followCount: {
                    $size: "$followCount",
                  },
                },
              },
              {
                $sort: {
                  likeCount: -1,
                },
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
              },
            ])
            .toArray();
          break;
        }
        case totalSortMode.FOLLOW: {
          ret.arr = await users
            .aggregate([
              {
                $match: {
                  username: regex,
                },
              },
              {
                $addFields: {
                  _id: {
                    $convert: {
                      input: "$_id",
                      to: "string",
                    },
                  },
                },
              },
              {
                $lookup: {
                  from: "follows",
                  localField: "_id",
                  foreignField: "userTo",
                  as: "followCount",
                },
              },
              {
                $addFields: {
                  followCount: {
                    $size: "$followCount",
                  },
                },
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
              },
            ])
            .toArray();
          break;
        }

        default:
          break;
      }
      return ret;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
};
