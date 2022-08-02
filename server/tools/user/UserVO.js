const { ObjectId } = require("mongodb");
class UserVO {
  /**
   *
   * @param {Object} data
   */
  constructor(data, msgNum = 0) {
    this.id = data._id;
    this.username = data.username;
    this.head_picture = data.head_picture;
    this.words = data.words;
    this.sex = data.sex;
    this.foundtime = data.foundtime;
    this.email = data.email;
    this.likeCount = data.likeCount;
    this.msgNum = msgNum;
    this.permit = data.permit;
    this.age = data.age;
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
      msgNum: this.msgNum,
      permit: this.permit,
      age: this.age,
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
