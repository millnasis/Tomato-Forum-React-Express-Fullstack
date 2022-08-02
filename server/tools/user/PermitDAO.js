const { ObjectId } = require("mongodb");
const db = require("../db");
const dbName = "permit";

module.exports = class PermitDAO {
  async queryByUserIDAndPassWord(userid, password) {
    try {
      const permit = await db(dbName);
      let ret = await permit
        .find({ userid: ObjectId(userid), password })
        .toArray();
      if (ret.length === 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async createUserByUserIDAndPassword(userid, password) {
    try {
      const permit = await db(dbName);
      const ret = await permit.insertOne({
        userid: ObjectId(userid),
        password,
        permit: "user",
      });
      return ret;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteUserByUsernameAndPassword(username) {
    try {
      const permit = await db(dbName);
      await permit.deleteOne({ username: username });
      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async queryByUsername(username) {
    try {
      const permit = await db(dbName);
      let ret = await permit.find({ username: username }).toArray();

      if (ret.length === 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async queryAdminPermit(username) {
    try {
      const permit = await db(dbName);
      const ret = await permit.find({ username, permit: "admin" }).toArray();
      if (ret.length === 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  }
};
