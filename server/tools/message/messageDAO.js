const db = require("../db");
const { ObjectId } = require("mongodb");
const PostDAO = require("../post/PostDAO");
const ReplyDAO = require("../post/ReplyDAO");

const dbName = "messages";

const TotalMSGtype = {
  LIKE: "like",
  REPLY: "reply",
  COMMENT: "comment",
  MEMTION: "mention",
};

const TotalTargetType = {
  POST: "post",
  REPLY: "reply",
  COMMENT: "comment",
};

class MessageDAO {
  /**
   *
   * @param {String} userFrom
   * @param {String} userTo
   * @param {String} targetid
   * @param {String} targetType
   * @param {String} MSGtype
   * @returns {Promise<Boolean>}
   */
  async toggleMSG(userFrom, userTo, targetid, targetType, MSGtype) {
    try {
      const messages = await db(dbName);
      switch (MSGtype) {
        case TotalMSGtype.LIKE: {
          targetid =
            targetType === TotalTargetType.COMMENT
              ? targetid
              : ObjectId(targetid);
          userTo = ObjectId(userTo);
          userFrom = ObjectId(userFrom);
          let query = await messages
            .find({
              userTo: userTo,
              targetid: targetid,
              targetType,
              MSGtype,
            })
            .toArray();
          if (query.length === 0) {
            let ret = await messages.insertOne({
              userTo: userTo,
              targetid: targetid,
              targetType,
              MSGtype,
              likeList: [{ userid: userFrom, foundtime: new Date() }],
              lastUpdate: new Date(),
              read: false,
            });
            return ret;
          } else {
            const queryUsr = await messages
              .aggregate([
                {
                  $match: {
                    userTo: userTo,
                    targetid: targetid,
                    targetType,
                    MSGtype,
                  },
                },
                {
                  $unwind: "$likeList",
                },
                {
                  $match: {
                    "likeList.userid": userFrom,
                  },
                },
              ])
              .toArray();
            if (queryUsr.length === 0) {
              let ret = await messages.updateOne(
                {
                  userTo: userTo,
                  targetid: targetid,
                  targetType,
                  MSGtype,
                },
                {
                  $push: {
                    likeList: {
                      userid: userFrom,
                      foundtime: new Date(),
                    },
                  },
                  $set: {
                    lastUpdate: new Date(),
                    read: false,
                  },
                }
              );
              return ret;
            } else if (queryUsr.length === 1) {
              if (query[0].likeList.length === 1) {
                let ret = await messages.deleteOne({
                  userTo: userTo,
                  targetid: targetid,
                  targetType,
                  MSGtype,
                });
                return ret;
              } else {
                let ret = await messages.updateOne(
                  {
                    userTo: userTo,
                    targetid: targetid,
                    targetType,
                    MSGtype,
                  },
                  {
                    $pull: {
                      likeList: {
                        userid: userFrom,
                      },
                    },
                  }
                );
                return ret;
              }
            }
          }
        }
        case TotalMSGtype.COMMENT: {
          let query = await messages
            .find({
              userFrom: ObjectId(userFrom),
              userTo: ObjectId(userTo),
              targetid: targetid,
              targetType,
              MSGtype,
            })
            .toArray();
          if (query.length === 0) {
            let ret = await messages.insertOne({
              userFrom: ObjectId(userFrom),
              userTo: ObjectId(userTo),
              targetid: targetid,
              targetType,
              MSGtype,
              lastUpdate: new Date(),
              read: false,
            });
            return ret;
          } else {
            let ret = await messages.deleteOne({
              userFrom: ObjectId(userFrom),
              userTo: ObjectId(userTo),
              targetid: targetid,
              targetType,
              MSGtype,
            });
            return ret;
          }
        }
        default: {
          let query = await messages
            .find({
              userFrom: ObjectId(userFrom),
              userTo: ObjectId(userTo),
              targetid: ObjectId(targetid),
              targetType,
              MSGtype,
            })
            .toArray();
          if (query.length === 0) {
            let ret = await messages.insertOne({
              userFrom: ObjectId(userFrom),
              userTo: ObjectId(userTo),
              targetid: ObjectId(targetid),
              targetType,
              MSGtype,
              lastUpdate: new Date(),
              read: false,
            });
            return ret;
          } else {
            let ret = await messages.deleteOne({
              userFrom: ObjectId(userFrom),
              userTo: ObjectId(userTo),
              targetid: ObjectId(targetid),
              targetType,
              MSGtype,
            });
            return ret;
          }
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   *
   * @param {String} userid
   * @param {String} MSGtype
   * @param {int} skip
   * @param {int} limit
   * @returns {Promise<Array>}
   */
  async queryMSGByUserIDAndMSGtype(userid, MSGtype, skip = 0, limit = 10) {
    try {
      skip = parseInt(skip);
      limit = parseInt(limit);
      const messages = await db(dbName);
      switch (MSGtype) {
        case TotalMSGtype.LIKE: {
          let ret = await messages
            .aggregate([
              {
                $match: {
                  userTo: ObjectId(userid),
                  MSGtype,
                },
              },
              { $skip: skip },
              { $limit: limit },
              { $unwind: "$likeList" },
              {
                $lookup: {
                  from: "users",
                  localField: "likeList.userid",
                  foreignField: "_id",
                  as: "likeList.user",
                },
              },
              { $unwind: "$likeList.user" },
              {
                $group: {
                  _id: "$_id",
                  userTo: { $first: "$userTo" },
                  targetid: { $first: "$targetid" },
                  targetType: { $first: "$targetType" },
                  MSGtype: { $first: "$MSGtype" },
                  likeList: { $push: "$likeList" },
                  lastUpdate: { $first: "$lastUpdate" },
                  read: { $first: "$read" },
                },
              },
            ])
            .toArray();
          const postDAO = new PostDAO();
          const replyDAO = new ReplyDAO();
          ret = Promise.all(
            ret.map(async (value) => {
              switch (value.targetType) {
                case TotalTargetType.POST:
                  let queryPost = await postDAO.queryByID(value.targetid);
                  return {
                    ...value,
                    target: queryPost.getOriginData(),
                  };
                case TotalTargetType.REPLY:
                  let queryReply = await replyDAO.queryByID(value.targetid);
                  return {
                    ...value,
                    target: queryReply.getOriginData(),
                  };
                case TotalTargetType.COMMENT:
                  let queryComment = await replyDAO.queryCommentByCommentID(
                    value.targetid
                  );
                  return {
                    ...value,
                    target: queryComment.getOriginData(),
                  };
                default:
                  break;
              }
            })
          );
          return ret;
        }
        case TotalMSGtype.REPLY: {
          let ret = await messages
            .aggregate([
              {
                $match: {
                  userTo: ObjectId(userid),
                  MSGtype,
                },
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
              },
              {
                $lookup: {
                  from: "users",
                  localField: "userFrom",
                  foreignField: "_id",
                  as: "userFrom",
                },
              },
              {
                $unwind: "$userFrom",
              },
              {
                $lookup: {
                  from: "replys",
                  localField: "targetid",
                  foreignField: "_id",
                  as: "target",
                },
              },
              {
                $unwind: "$target",
              },
              {
                $lookup: {
                  from: "posts",
                  localField: "target.masterID",
                  foreignField: "_id",
                  as: "target.master",
                },
              },
              {
                $unwind: "$target.master",
              },
            ])
            .toArray();
          return ret;
        }
        case TotalMSGtype.COMMENT: {
          let ret = await messages
            .aggregate([
              {
                $match: {
                  userTo: ObjectId(userid),
                  MSGtype,
                },
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
              },
              {
                $lookup: {
                  from: "users",
                  localField: "userFrom",
                  foreignField: "_id",
                  as: "userFrom",
                },
              },
              {
                $unwind: "$userFrom",
              },
            ])
            .toArray();
          const replyDAO = new ReplyDAO();
          ret = Promise.all(
            ret.map(async (value) => {
              let queryComment = await replyDAO.queryCommentByCommentID(
                value.targetid
              );
              return {
                ...value,
                target: queryComment.getOriginData(),
              };
            })
          );
          return ret;
        }
        case TotalMSGtype.MEMTION: {
          return [];
        }
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async queryMessageSumByUserIDAndMSGtype(userid, MSGtype) {
    try {
      const messages = await db(dbName);
      let ret = await messages
        .aggregate([
          {
            $match: {
              userTo: ObjectId(userid),
              MSGtype,
            },
          },
          {
            $count: "sum",
          },
        ])
        .toArray();
      return ret[0].sum;
    } catch (error) {
      return false;
    }
  }
}

MessageDAO.TotalMSGtype = TotalMSGtype;
MessageDAO.TotalTargetType = TotalTargetType;
module.exports = MessageDAO;
