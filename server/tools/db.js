
/**
 * 使用方法：const schema = await db(schemaName)
 * @param {String} name schema-name
 * @returns Promise schema
 */
async function getdb(name) {
  const { dbURL } = require("../config/config");
  const { promisify } = require("util");
  const mongoCLient = require("mongodb").MongoClient;

  const connect = promisify(mongoCLient.connect);

  const connection = await connect(dbURL);
  const db = connection.db("InternetForum");
  return db.collection(name);
};


module.exports = getdb