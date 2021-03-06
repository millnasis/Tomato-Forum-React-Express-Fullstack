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

  async deleteUserByID(userid) {
    try {
      const permit = await db(dbName);
      const ret = await permit.deleteOne({ userid: ObjectId(userid) });
      return ret;
    } catch (error) {
      console.error(error);
      return false;
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

  async queryAdminPermit(userid) {
    try {
      const permit = await db(dbName);
      const ret = await permit
        .find({ userid: ObjectId(userid), permit: "admin" })
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

  async updateUserPermit(userid, userPermit) {
    try {
      const permit = await db(dbName);
      const ret = await permit.updateOne(
        { userid: ObjectId(userid) },
        {
          $set: {
            permit: userPermit,
          },
        }
      );
      return ret;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
};
