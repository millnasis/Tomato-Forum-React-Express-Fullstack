const db = require("../db");
const { ObjectId } = require("mongodb");

class CommentVO {
  constructor(data, dbName) {
    this.dbName = dbName;
    this.id = data.id;
    this.content = data.content;
    this.foundtime = data.foundtime || new Date();
    this.publisher = Array.isArray(data.publisher)
      ? data.publisher[0]
      : data.publisher;
    this.likeList = data.likeList;
    //   count为所属楼数
    this.masterID = data.masterID;
    this.master = Array.isArray(data.master) ? data.master[0] : data.master;
    this.isMention = data.isMention;
    this.mentionID = data.mentionID;
    this.mentionUser = Array.isArray(data.mentionUser)
      ? data.mentionUser[0]
      : data.mentionUser;
    this.mention = data.mention;
  }

  getOriginData() {
    return {
      id: this.id,
      content: this.content,
      foundtime: this.foundtime,
      publisher: this.publisher,
      likeList: this.likeList,
      masterID: this.masterID,
      master: this.master,
      isMention: this.isMention,
      mentionID: this.mentionID,
      mentionUser: this.mentionUser,
      mention: this.mention,
    };
  }

  /**
   *
   * @param {String} publisher
   * @returns {Promise<Boolean>}
   */
  async toggleLikeByPublisher(publisher) {
    try {
      const schema = await db(this.dbName);
      const query = await schema
        .aggregate([
          {
            $match: { _id: this.masterID },
          },
          {
            $unwind: "$comments",
          },
          {
            $project: { comments: 1 },
          },
          {
            $match: { "comments.id": this.id },
          },
          {
            $unwind: "$comments.likeList",
          },
          {
            $match: { "comments.likeList": publisher },
          },
        ])
        .toArray();
      if (query.length === 0) {
        await schema.updateOne(
          {
            _id: ObjectId(this.masterID),
          },
          {
            $push: {
              "comments.$[item].likeList": publisher,
            },
          },
          {
            arrayFilters: [
              {
                "item.id": this.id,
              },
            ],
          }
        );
        this.likeList.push(publisher);
      } else {
        await schema.updateOne(
          {
            _id: ObjectId(this.masterID),
          },
          {
            $pull: {
              "comments.$[item].likeList": publisher,
            },
          },
          {
            arrayFilters: [
              {
                "item.id": this.id,
              },
            ],
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

module.exports = CommentVO;
