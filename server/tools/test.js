const { ObjectId } = require("mongodb");
const db = require("./db");

const dbName = "permit";

// (async () => {
//   const permit = await db(dbName);
//   const users = await db("users");
//   const userArr = await users.find({}).toArray();
//   userArr.forEach(async (v) => {
//     await permit.updateOne(
//       { username: v.username },
//       {
//         $set: { userid: ObjectId(v._id), permit: "user" },
//         $unset: { username: "" },
//       }
//     );
//   });
// })();

(async () => {
  const search = await db("search");
  // const ret = await search.updateMany({}, { $set: { type: "normal" } });
  const ret = await search.updateMany(
    { type: "normal" },
    { $set: { type: "NORMAL" } }
  );
  console.log(ret);
  await search.updateOne({ type: "control" }, { $set: { type: "CONTROL" } });
})();
