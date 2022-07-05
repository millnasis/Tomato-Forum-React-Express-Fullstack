(async () => {
  const { ObjectId } = require("mongodb");
  const db = require("../db");
  const posts = await db("posts");
  let ret = await posts.insertOne({
    title: "测试",
    content: "<p>测试</p>",
    foundtime: new Date(),
    lasttime: new Date(),
    publisher: "kkk",
    comments: [],
    click: 0,
    likeList: [],
  });
  console.log(ret);
})();
