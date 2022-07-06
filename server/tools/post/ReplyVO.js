const CommentVO = require("./CommentVO");
const db = require("../db");
const { ObjectId } = require("mongodb");

const dbName = "replys";

/**
 * ReplyVO，跟帖数据模型，包含如下内容
 * getOriginData以JS对象为模型获取跟帖数据，不包括评论
 * 对评论Comment的增 删 查，使用CommentVO数据模型
 * 点赞和取消点赞
 */
class ReplyVO {
  constructor(data) {
    this.id = data._id;
    this.content = data.content;
    this.foundtime = data.foundtime || new Date();
    this.publisher = Array.isArray(data.publisher)
      ? data.publisher[0]
      : data.publisher;
    this.comments = data.comments;
    this.count = data.count;
    this.likeList = data.likeList;
    //   count为所属楼数
    this.masterID = data.masterID;
    this.master = data.master;
    this.commentCount = data.comments.length;
  }

  getOriginData() {
    return {
      id: this.id,
      content: this.content,
      foundtime: this.foundtime,
      publisher: this.publisher,
      likeList: this.likeList,
      masterID: this.masterID,
      count: this.count,
      comments: this.comments.map((value) =>
        typeof value.getOriginData === "function"
          ? value.getOriginData()
          : value
      ),
      commentCount: this.commentCount,
      master: Array.isArray(this.master) ? this.master[0] : undefined,
    };
  }

  /**
   *
   * @returns {Promise<int>}
   */
  async getCommentSum() {
    const replys = await db(dbName);

    let ret = await replys
      .aggregate([
        {
          $match: { _id: ObjectId(this.id) },
        },
        {
          $project: {
            count: {
              $size: "$comments",
            },
          },
        },
      ])
      .toArray();
    if (ret.length === 0) {
      return false;
    }

    return ret[0].count;
  }

  async getCommentByID(ID) {
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
              from: "replys",
              localField: "comments.masterID",
              foreignField: "_id",
              as: "comments.master",
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
      if (ret.isMention) {
        let mentionRet = await replys
        .aggregate([
          {
            $unwind: "$comments",
          },
          {
            $match: {
              "comments.id": ret.mentionID,
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
        mentionRet = mentionRet[0].comments;
        const query = new CommentVO(mentionRet,dbName);
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
   * @param {int} skip
   * @param {int} limit
   * @returns {Promise<Array<CommentVO>>}
   */
  async getCommentBySkipAndLimit(skip = 0, limit = 20) {
    const replys = await db(dbName);
    skip = parseInt(skip);
    limit = parseInt(limit);
    let ret = await replys
      .aggregate([
        { $match: { _id: ObjectId(this.id) } },
        { $unwind: "$comments" },
        { $skip: skip },
        { $limit: limit },
        { $project: { comments: 1 } },
        {
          $addFields: {
            "comments.publisher": {
              $convert: {
                input: "$comments.publisher",
                to: "objectId",
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "comments.publisher",
            foreignField: "_id",
            as: "comments.publisher",
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
      ])
      .toArray();

    if (ret.length === 0) {
      return [];
    }
    return ret.map((value) => {
      return new CommentVO(value.comments, dbName);
    });
  }

  /**
   *
   * @param {String} content
   * @param {String} publisher
   * @returns {Promise<String>} insertedId
   */
  async createCommentByContentAndPublisher(
    content,
    publisher,
    isMention,
    mentionID = null,
    mentionUser = null
  ) {
    try {
      const replys = await db(dbName);
      const commentid = publisher + Date.now();
      await replys.updateOne(
        { _id: this.id },
        {
          $push: {
            comments: {
              id: commentid,
              content: content,
              foundtime: new Date(),
              publisher: publisher,
              likeList: [],
              masterID: this.id,
              isMention,
              mentionID,
              mentionUser: ObjectId(mentionUser),
            },
          },
        }
      );
      return commentid;
    } catch (error) {
      return false;
    }
  }

  async deleteCommentByID(ID) {
    const replys = await db(dbName);

    await replys.updateOne(
      { _id: ObjectId(this.id) },
      {
        $pull: {
          comments: {
            $elemMatch: {
              id: ID,
            },
          },
        },
      }
    );

    return true;
  }

  /**
   *
   * @param {String} publisher
   * @returns {Promise<Boolean>}
   */
  async toggleLikeByPublisher(publisher) {
    try {
      const replys = await db(dbName);
      const query = await replys
        .aggregate([
          {
            $match: { _id: this.id },
          },
          {
            $unwind: "$likeList",
          },
          {
            $project: { likeList: 1 },
          },
          {
            $match: { likeList: publisher },
          },
        ])
        .toArray();
      if (query.length === 0) {
        await replys.updateOne(
          { _id: this.id },
          {
            $push: {
              likeList: publisher,
            },
          }
        );
        this.likeList.push(publisher);
      } else {
        await replys.updateOne(
          { _id: this.id },
          {
            $pull: {
              likeList: publisher,
            },
          }
        );
        this.likeList.splice(
          this.likeList.findIndex((value) => value === publisher),
          1
        );
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  getID() {
    return this.id;
  }
}

module.exports = ReplyVO;
