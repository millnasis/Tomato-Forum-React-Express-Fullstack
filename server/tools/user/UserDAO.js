const db = require("../db");
const PermitDAO = require("./PermitDAO");
const UserVO = require("./UserVO");
const { ObjectId } = require("mongodb");
const MessageDAO = require("../message/messageDAO");

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

  async queryByUserPermit(username, password) {
    try {
      const permit = new PermitDAO();
      let condition = await permit.queryByUserNameAndPassWord(
        username,
        password
      );
      if (!condition) {
        return false;
      }
      const users = await db(dbName);
      let ret = await users.find({ username: username }).toArray();

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
      let condition = await permit.queryByUsername(username);
      if (condition) {
        return false;
      }
      const users = await db(dbName);

      await permit.createUserByUsernameAndPassword(username, password);

      await users.insertOne({
        username: username,
        head_picture: default_head_picture,
        words: "编辑个性签名",
        age: 0,
        foundtime: new Date(),
        likeCount: 0,
      });
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
};
