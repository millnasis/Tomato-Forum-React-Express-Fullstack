const db = require("../db");
const { ObjectId } = require("mongodb");
const PostVO = require("./PostVO");
const ReplyVO = require("./ReplyVO");
const CommentVO = require("./CommentVO");

const dbName = "replys";

module.exports = class ReplyDAO {
  /**
   *
   * @param {*} postID
   * @param {int} skip
   * @param {int} limit
   * @returns {Promise<Array<ReplyVO>>} replyVO
   */
  async queryByPostIdAndSkip(postID, skip = 0, limit = 20) {
    skip = parseInt(skip);
    limit = parseInt(limit);
    const replys = await db(dbName);
    let ret = await replys
      .aggregate([
        { $match: { masterID: postID } },
        { $skip: skip },
        { $limit: limit },
        {
          $addFields: {
            publisher: {
              $convert: {
                input: "$publisher",
                to: "objectId",
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "publisher",
            foreignField: "_id",
            as: "publisher",
          },
        },
      ])
      .toArray();
    if (!ret) {
      return false;
    }
    ret = ret.map(async (value) => {
      const replyVO = new ReplyVO(value);
      replyVO.comments = await replyVO.getCommentBySkipAndLimit(0, 5);
      return replyVO;
    });
    ret = await Promise.all(ret);
    return ret;
  }

  /**
   *
   * @param {String} userid
   * @returns {Promise<Array<ReplyVO>}
   */
  async queryByUserID(userid, skip, limit) {
    try {
      skip = parseInt(skip);
      limit = parseInt(limit);
      const replys = await db(dbName);
      let ret = await replys
        .aggregate([
          {
            $match: {
              publisher: userid,
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
          {
            $lookup: {
              from: "posts",
              localField: "masterID",
              foreignField: "_id",
              as: "master",
            },
          },
        ])
        .toArray();
      ret = ret.map((value) => new ReplyVO(value));
      return ret;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async queryCommentByCommentID(ID, queryMention = true) {
    try {
      const replys = await db(dbName);
      let ret = await replys
        .aggregate([
          {
            $unwind: "$comments",
          },
          {
            $match: {
              "comments.id": ID,
            },
          },
          {
            $lookup: {
              from:"replys",
              localField:"comments.masterID",
              foreignField:"_id",
              as:"comments.master"
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "comments.mentionUser",
              foreignField: "_id",
              as: "comments.mentionUser",
            },
          },
          {
            $project: { comments: 1 },
          },
        ])
        .toArray();
      ret = ret[0].comments;
      if (ret.isMention && queryMention) {
        const replyDAO = new ReplyDAO();
        let query = await replyDAO.queryCommentByCommentID(
          ret.mentionID,
          false
        );
        ret.mention = query.getOriginData();
      }
      return new CommentVO(ret, dbName);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   *
   * @param {String} userid
   * @returns {Promise<Array<CommentVO>>}
   */
  async queryAllCommentByUserID(userid, skip, limit) {
    try {
      skip = parseInt(skip);
      limit = parseInt(limit);
      const replys = await db(dbName);
      let ret = await replys
        .aggregate([
          {
            $unwind: "$comments",
          },
          {
            $project: {
              comments: 1,
            },
          },
          {
            $match: {
              "comments.publisher": userid,
            },
          },
          {
            $sort: {
              "comments.foundtime": -1,
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
              from: "replys",
              localField: "comments.masterID",
              foreignField: "_id",
              as: "comments.master",
            },
          },
        ])
        .toArray();
      ret = ret.map((value) => new CommentVO(value.comments, dbName));
      return ret;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   *
   * @param {String} ID
   * @returns {Promise<int>}
   */
  async querySumByPostID(ID) {
    try {
      const replys = await db(dbName);
      let ret = await replys
        .aggregate([
          {
            $match: {
              masterID: ID,
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

  async querySumByUserID(userid) {
    try {
      const replys = await db(dbName);
      let ret = await replys
        .aggregate([
          {
            $match: {
              publisher: userid,
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

  async queryCommentSumByUserID(userid) {
    try {
      const replys = await db(dbName);
      let ret = await replys
        .aggregate([
          {
            $unwind: "$comments",
          },
          {
            $project: {
              comments: 1,
            },
          },
          {
            $match: {
              "comments.publisher": userid,
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

  /**
   *
   * @param {String} ID
   * @returns {Promise<ReplyVO>}
   */
  async queryByID(ID) {
    try {
      const replys = await db(dbName);
      if (typeof ID === "string") {
        ID = ObjectId(ID);
      }
      let ret = await replys.find({ _id: ID }).toArray();

      return new ReplyVO(ret[0]);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async createByContentAndPublisherAndCount(
    content,
    publisher,
    masterID,
    count
  ) {
    try {
      const replys = await db(dbName);
      let ret = await replys.insertOne({
        content: content,
        foundtime: new Date(),
        publisher: publisher,
        comments: [],
        likeList: [],
        count: count + 1,
        masterID: masterID,
      });
      return ret;
    } catch (error) {
      return false;
    }
  }

  async deleteByID(ID) {
    try {
      const replys = await db(dbName);

      await replys.deleteOne({ _id: ObjectId(ID) });

      return true;
    } catch (error) {
      return false;
    }
  }
};
