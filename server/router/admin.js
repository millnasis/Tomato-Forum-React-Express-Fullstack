const express = require("express");
const UserDAO = require("../tools/user/UserDAO");
const PostDAO = require("../tools/post/PostDAO");
const ReplyVO = require("../tools/post/ReplyVO");
const ReplyDAO = require("../tools/post/replyDAO");
const check = require("../tools/check");
const router = express.Router();
const { checkAdmin } = check;

router.use(checkAdmin);

router.get("/query/post", async (req, res) => {
  const postDAO = new PostDAO();
  const ret = await postDAO.adminQuery(req.query);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  ret.arr = ret.arr.map((v) => v.getOriginData());
  res.send(ret);
});

module.exports = router;
