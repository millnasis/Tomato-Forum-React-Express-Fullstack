const db = require("../db");
const { ObjectId } = require("mongodb");
const PostVO = require("./PostVO");
const ReplyDAO = require("./replyDAO");
const constant = require("../constant");
const getRegexByKeyword = require("../getRegexByKeyword");

const { totalSortMode, oneDayMSec } = constant;

const dbName = "posts";

module.exports = class PostDAO {
  async deleteByID(id) {
    try {
      id = ObjectId(id);
      const posts = await db(dbName);
      const ret = await posts.deleteOne({ _id: id });
      return ret;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async adminUpdate(id, obj) {
    try {
      id = ObjectId(id);
      delete obj.id;
      const posts = await db(dbName);
      const ret = await posts.updateOne(
        { _id: id },
        {
          $set: {
            ...obj,
            click: +obj.click,
            foundtime: new Date(obj.foundtime),
            lasttime: new Date(obj.lasttime),
          },
        }
      );
      return ret;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   *
   * @param {object} query
   * @returns {Promise< { arr:Array<PostVO> , pagination:object } >}
   */
  async adminQuery(query) {
    try {
      let { current, pageSize, id, title, publisher } = query;
      const posts = await db(dbName);
      const aggregate = [];
      const match = {};
      if (id) {
        id = ObjectId(id);
        match["_id"] = id;
      }
      if (title) {
        match["title"] = new RegExp(title);
      }
      if (publisher) {
        match["publisher"] = publisher;
      }
      aggregate.push({ $match: match }, { $sort: { foundtime: -1 } });
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
      aggregate.push(
        ...[
          {
            $addFields: {
              publisher: {
                $convert: {
                  input: "$publisher",
                  to: "objectId",
                },
              },
            },
            // userid是String类型，转换为objectId类型，再做关联查询
          },
          {
            $lookup: {
              from: "users",
              localField: "publisher",
              foreignField: "_id",
              as: "publisher",
            },
          },
          {
            $addFields: {
              favorite: {
                $convert: {
                  input: "$_id",
                  to: "string",
                },
              },
            },
          },
          {
            $lookup: {
              from: "favorites",
              localField: "favorite",
              foreignField: "postid",
              as: "favorite",
            },
          },
        ]
      );

      let ret = await posts.aggregate(aggregate).toArray();
      const sum = await posts
        .aggregate([
          {
            $match: match,
          },
          {
            $count: "sum",
          },
        ])
        .toArray();
      ret = ret.map((value) => {
        return new PostVO(value);
      });
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

  /**
   *
   * @param {string} ID
   * @returns {Promise<PostVO>}
   */
  async queryByID(ID) {
    try {
      const posts = await db(dbName);
      let ret = await posts
        .aggregate([
          { $match: { _id: ObjectId(ID) } },
          {
            $addFields: {
              publisher: {
                $convert: {
                  input: "$publisher",
                  to: "objectId",
                },
              },
            },
            // userid是String类型，转换为objectId类型，再做关联查询
          },
          {
            $lookup: {
              from: "users",
              localField: "publisher",
              foreignField: "_id",
              as: "publisher",
            },
          },
          {
            $addFields: {
              favorite: {
                $convert: {
                  input: "$_id",
                  to: "string",
                },
              },
            },
          },
          {
            $lookup: {
              from: "favorites",
              localField: "favorite",
              foreignField: "postid",
              as: "favorite",
            },
          },
        ])
        .toArray();

      if (ret.length === 0) {
        return false;
      }

      const postVO = new PostVO(ret[0]);
      // postVO.comments = await postVO.getCommentBySkipAndLimit(0, 5);
      return postVO;
    } catch (error) {
      return false;
    }
  }

  /**
   *
   * @param {String} userid
   * @returns {Promise<Array<PostVO>}
   */
  async queryByUserID(userid, skip, limit) {
    try {
      skip = parseInt(skip);
      limit = parseInt(limit);
      const posts = await db(dbName);
      let ret = await posts
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
        ])
        .toArray();
      ret = ret.map((value) => {
        return new PostVO(value);
      });
      return ret;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   *
   * @param {int} skip
   * @param {int} limit
   * @returns {Promise<Array<Object>>}
   */
  async queryRecommendHot(skip = 0, limit = 20) {
    try {
      skip = parseInt(skip);
      limit = parseInt(limit);
      const posts = await db(dbName);
      let ret = await posts
        .aggregate([
          {
            $addFields: {
              likeCount: {
                $size: "$likeList",
              },
            },
          },
          {
            $lookup: {
              from: "replys",
              localField: "_id",
              foreignField: "masterID",
              as: "replyCount",
            },
          },
          {
            $addFields: {
              replyCount: {
                $size: "$replyCount",
              },
            },
          },
          {
            $addFields: {
              hot: {
                $add: ["$replyCount", "$likeCount"],
              },
            },
          },
          {
            $sort: {
              hot: -1,
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
      if (ret.length === 0) {
        return false;
      }

      return ret.map((value) => {
        return {
          id: value._id,
          content: value.content,
          foundtime: value.foundtime,
          title: value.title,
          lasttime: value.lasttime,
          publisher: value.publisher,
          likeCount: value.likeCount,
          replyCount: value.replyCount,
          click: value.click,
        };
      });
    } catch (error) {
      return false;
    }
  }

  /**
   *
   * @param {int} skip
   * @param {int} limit
   * @returns {Promise<Array<Object>>}
   */
  async queryRecommendNew(skip = 0, limit = 20) {
    try {
      skip = parseInt(skip);
      limit = parseInt(limit);
      const posts = await db(dbName);
      let ret = await posts
        .aggregate([
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
            $addFields: {
              likeCount: {
                $size: "$likeList",
              },
            },
          },
          {
            $lookup: {
              from: "replys",
              localField: "_id",
              foreignField: "masterID",
              as: "replyCount",
            },
          },
          {
            $addFields: {
              replyCount: {
                $size: "$replyCount",
              },
            },
          },
        ])
        .toArray();

      if (ret.length === 0) {
        return false;
      }
      return ret.map((value) => {
        return {
          id: value._id,
          content: value.content,
          foundtime: value.foundtime,
          title: value.title,
          lasttime: value.lasttime,
          publisher: value.publisher,
          likeCount: value.likeCount,
          replyCount: value.replyCount,
          click: value.click,
        };
      });
    } catch (error) {
      return false;
    }
  }

  async queryLatestAndClick(limit = 20) {
    try {
      limit = parseInt(limit);
      const posts = await db(dbName);
      let ret = await posts
        .aggregate([
          {
            $match: {
              lasttime: {
                $gte: new Date(Date.now() - 7 * oneDayMSec),
              },
            },
          },
          {
            $sort: {
              click: -1,
            },
          },
          {
            $limit: limit,
          },
          {
            $addFields: {
              likeCount: {
                $size: "$likeList",
              },
            },
          },
          {
            $lookup: {
              from: "replys",
              localField: "_id",
              foreignField: "masterID",
              as: "replyCount",
            },
          },
          {
            $addFields: {
              replyCount: {
                $size: "$replyCount",
              },
            },
          },
        ])
        .toArray();
      if (ret.length === 0) {
        return [];
      }
      return ret.map((value) => {
        return {
          id: value._id,
          content: value.content,
          foundtime: value.foundtime,
          title: value.title,
          lasttime: value.lasttime,
          publisher: value.publisher,
          likeCount: value.likeCount,
          replyCount: value.replyCount,
          click: value.click,
        };
      });
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async querySumByUserID(userid) {
    try {
      const posts = await db(dbName);
      let ret = await posts
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

  /**
   *
   * @param {String} ID
   * @returns {Promise<int> | Boolean}
   */
  async queryReplySumByPostID(ID) {
    try {
      const replyDAO = new ReplyDAO();
      let ret = await replyDAO.querySumByPostID(ID);
      return ret;
    } catch (error) {
      return false;
    }
  }

  /**
   *
   * @param {String} title
   * @param {String} content
   * @param {String} publisher
   * @returns {Promise<ObjectId>}
   */
  async createByTitleAndContentAndPublisher(title, content, publisher) {
    try {
      const posts = await db(dbName);
      let ret = await posts.insertOne({
        title,
        content,
        foundtime: new Date(),
        lasttime: new Date(),
        publisher,
        comments: [],
        click: 0,
        likeList: [],
        replyCount: 0,
      });
      return ret;
    } catch (error) {
      return false;
    }
  }

  async search(keyword, sortMode, skip, limit) {
    // console.log(keyword, sortMode, skip, limit);
    skip = parseInt(skip);
    limit = parseInt(limit);
    const regex = getRegexByKeyword(keyword);
    try {
      const posts = await db(dbName);
      let ret = {};
      let sum = await posts
        .aggregate([
          {
            $match: {
              $or: [
                {
                  title: {
                    $regex: regex,
                  },
                },
                {
                  content: {
                    $regex: regex,
                  },
                },
              ],
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
          ret.arr = await posts
            .aggregate([
              {
                $match: {
                  $or: [
                    {
                      title: {
                        $regex: regex,
                      },
                    },
                    {
                      content: {
                        $regex: regex,
                      },
                    },
                  ],
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
        case totalSortMode.CLICK: {
          ret.arr = await posts
            .aggregate([
              {
                $match: {
                  $or: [
                    {
                      title: {
                        $regex: regex,
                      },
                    },
                    {
                      content: {
                        $regex: regex,
                      },
                    },
                  ],
                },
              },
              {
                $sort: {
                  click: -1,
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
          ret.arr = await posts
            .aggregate([
              {
                $match: {
                  $or: [
                    {
                      title: {
                        $regex: regex,
                      },
                    },
                    {
                      content: {
                        $regex: regex,
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  likeCount: {
                    $size: "$likeList",
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
        case totalSortMode.FAVORITE: {
          ret.arr = await posts
            .aggregate([
              {
                $addFields: {
                  postid: {
                    $convert: {
                      input: "$_id",
                      to: "string",
                    },
                  },
                },
              },
              {
                $lookup: {
                  from: "favorites",
                  localField: "postid",
                  foreignField: "postid",
                  as: "favoriteCount",
                },
              },
              {
                $addFields: {
                  favoriteCount: {
                    $size: "$favoriteCount",
                  },
                },
              },
              {
                $match: {
                  $or: [
                    {
                      title: {
                        $regex: regex,
                      },
                    },
                    {
                      content: {
                        $regex: regex,
                      },
                    },
                  ],
                },
              },
              {
                $sort: {
                  favoriteCount: -1,
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
        case totalSortMode.REPLY: {
          ret.arr = await posts
            .aggregate([
              {
                $lookup: {
                  from: "replys",
                  localField: "_id",
                  foreignField: "masterID",
                  as: "replyCount",
                },
              },
              {
                $addFields: {
                  replyCount: {
                    $size: "$replyCount",
                  },
                },
              },
              {
                $match: {
                  $or: [
                    {
                      title: {
                        $regex: regex,
                      },
                    },
                    {
                      content: {
                        $regex: regex,
                      },
                    },
                  ],
                },
              },
              {
                $sort: {
                  replyCount: -1,
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
      console.log(error);
      return false;
    }
  }

  async addClickByPostID(ID) {
    try {
      const posts = await db(dbName);
      if (typeof ID === "string") {
        ID = ObjectId(ID);
      }
      let ret = await posts.updateOne({ _id: ID }, { $inc: { click: 1 } });
      return ret;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async queryUserLikeAndReplySumByUserID(ID) {
    try {
      const posts = await db(dbName);
      const ret = await posts
        .aggregate([
          {
            $match: {
              publisher: ID,
            },
          },
          {
            $addFields: {
              like: {
                $size: "$likeList",
              },
            },
          },
          {
            $group: {
              _id: "$publisher",
              click: {
                $sum: "$click",
              },
              like: {
                $sum: "$like",
              },
              getReplySum: {
                $sum: "$replyCount",
              },
              postSum: {
                $count: {},
              },
            },
          },
        ])
        .toArray();
      if (ret.length === 0) {
        {
          return {
            _id: "auto_spawn",
            click: 0,
            like: 0,
            getReplySum: 0,
            postSum: 0,
          };
        }
      }
      return ret[0];
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async updateLastTimeByPostID(ID) {
    try {
      if (typeof ID === "string") {
        ID = ObjectId(ID);
      }
      const posts = await db(dbName);
      let ret = await posts.updateOne(
        { _id: ID },
        { $set: { lasttime: new Date() } }
      );
      return ret;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
};
