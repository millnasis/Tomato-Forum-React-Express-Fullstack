const ReplyDAO = require("./replyDAO");
const CommentVO = require("./CommentVO");
const ReplyVO = require("./ReplyVO");
const db = require("../db");
const constant = require("../constant");
const { ObjectId } = require("mongodb");

const dbName = "posts";

/**
 * PostVO，主贴数据模型，包含如下内容
 * getOriginData以JS对象为模型获取主贴数据，不包括评论和跟帖
 * 对跟帖Reply的增 删 查，跟帖使用ReplyVO数据模型
 * 对评论Comment的增 删 查，评论使用CommentVO的数据模型
 * 点赞和取消点赞方法
 */
class PostVO {
  constructor(data) {
    this.replyDAO = new ReplyDAO();
    this.id = data._id;
    this.title = data.title;
    this.content = data.content;
    this.foundtime = data.foundtime || new Date();
    this.lasttime = data.lasttime || new Date();
    this.publisher = Array.isArray(data.publisher)
      ? data.publisher.length === 0
        ? constant.nonExistUser
        : data.publisher[0]
      : data.publisher;
    // this.comments = data.comments;
    this.replyCount = data.replyCount;
    this.click = data.click;
    this.likeList = data.likeList;
    this.favorite = data.favorite;
  }

  getOriginData() {
    return {
      id: this.id,
      content: this.content,
      title: this.title,
      foundtime: this.foundtime,
      lasttime: this.lasttime,
      publisher: this.publisher,
      click: this.click,
      likeList: this.likeList,
      favorite: this.favorite,
      replyCount: this.replyCount,
    };
  }

  /**
   *
   * @param {int} skip
   * @param {int} limit
   * @returns {Promise<Array<ReplyVO>>} ReplyVO
   */
  async getReplyBySkipAndLimit(skip = 0, limit = 20) {
    const replyDAO = this.replyDAO;
    skip = parseInt(skip);
    limit = parseInt(limit);
    let retArr = await replyDAO.queryByPostIdAndSkip(this.id, skip, limit);
    if (!retArr) {
      return false;
    }
    return retArr;
  }

  /**
   *
   * @param {String} content
   * @param {String} publisher
   * @returns {Promise<String>} insertedId
   */
  async createReplyByContentAndPublisher(content, publisher) {
    const replyDAO = this.replyDAO;
    let ret = await replyDAO.createByContentAndPublisherAndCount(
      content,
      publisher,
      this.id,
      this.replyCount
    );
    if (!ret) {
      return false;
    }
    const posts = await db(dbName);
    await posts.updateOne(
      { _id: ObjectId(this.id) },
      { $inc: { replyCount: 1 } }
    );
    this.replyCount++;
    return ret.insertedId;
  }

  async deleteReplyByID(ID) {
    const replyDAO = this.replyDAO;
    await replyDAO.deleteByID(ID);

    return true;
  }

  /**
   *
   * @returns {Promise<int> | Boolean}
   */
  async getReplySum() {
    try {
      const replyDAO = new ReplyDAO();
      let ret = await replyDAO.querySumByPostID(this.id);
      return ret;
    } catch (error) {
      return false;
    }
  }

  /**
   *
   * @returns {Promise<int>}
   */
  async getCommentSum() {
    const posts = await db(dbName);

    let ret = await posts
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
    const posts = await db(dbName);

    let ret = await posts
      .aggregate([
        { $match: { _id: ObjectId(this.id) } },
        { $unwind: "$comments" },
        {
          $match: {
            "comments.id": ID,
          },
        },
        {
          $project: { comments: 1 },
        },
      ])
      .toArray();

    if (ret.length === 0) {
      return false;
    }

    return new CommentVO(ret[0].comments, dbName);
  }

  /**
   *
   * @param {int} skip
   * @param {int} limit
   * @returns {Promise<Array<CommentVO>>}
   */
  async getCommentBySkipAndLimit(skip = 0, limit = 20) {
    const posts = await db(dbName);
    skip = parseInt(skip);
    limit = parseInt(limit);
    let ret = await posts
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
      ])
      .toArray();

    if (ret.length === 0) {
      return [];
    }
    return ret.map((value) => {
      return new CommentVO(value.comments, dbName);
    });
  }

  async createCommentByContentAndPublisher(content, publisher) {
    const posts = await db(dbName);

    await posts.updateOne(
      { _id: ObjectId(this.id) },
      {
        $push: {
          commnets: {
            id: publisher + Date.now(),
            content: content,
            foundtime: new Date(),
            publisher: publisher,
            likeList: [],
            masterID: this.id,
          },
        },
      }
    );
    return true;
  }

  async deleteCommentByID(ID) {
    const posts = await db(dbName);

    await posts.updateOne(
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
      const posts = await db(dbName);
      let query = await posts
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
        await posts.updateOne(
          { _id: this.id },
          {
            $push: {
              likeList: publisher,
            },
          }
        );
        this.likeList.push(publisher);
        return 1;
      } else {
        await posts.updateOne(
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
        return -1;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  getID() {
    return this.id;
  }
}

module.exports = PostVO;
