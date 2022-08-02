const { ObjectId } = require("mongodb");
const db = require("./db");

const dbName = "permit";

(async () => {
  const permit = await db(dbName);
  const users = await db("users");
  const userArr = await users.find({}).toArray();
  userArr.forEach(async (v) => {
    await permit.updateOne(
      { username: v.username },
      {
        $set: { userid: ObjectId(v._id), permit: "user" },
        $unset: { username: "" },
      }
    );
  });
})();
