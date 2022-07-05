const { ObjectId } = require("mongodb");
class UserVO {
  /**
   *
   * @param {Object} data
   */
  constructor(data) {
    this.id = data._id;
    this.username = data.username;
    this.head_picture = data.head_picture;
    this.words = data.words;
    this.sex = data.sex;
    this.foundtime = data.foundtime;
    this.email = data.email;
    this.likeCount = data.likeCount;
  }

  changeInfo(data) {
    this.words = data.words;
    this.email = data.email;
    this.sex = data.sex;
    this.head_picture = data.head_picture;
  }

  getOriginData() {
    return {
      id: this.id,
      username: this.username,
      head_picture: this.head_picture,
      words: this.words,
      sex: this.sex,
      email: this.email,
      foundtime: this.foundtime,
      likeCount: this.likeCount,
    };
  }

  getChangeData() {
    return {
      sex: this.sex,
      email: this.email,
      head_picture: this.head_picture,
      words: this.words,
    };
  }

  /**
   *
   * @returns {ObjectId}
   */
  getId() {
    return this.id;
  }
}

module.exports = UserVO;
