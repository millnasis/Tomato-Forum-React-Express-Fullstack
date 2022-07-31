const express = require("express");
const UserDAO = require("../tools/user/UserDAO");
const PostDAO = require("../tools/post/PostDAO");
const ReplyVO = require("../tools/post/ReplyVO");
const ReplyDAO = require("../tools/post/replyDAO");
const check = require("../tools/check");
const router = express.Router();
const { checkAdmin } = check;

router.use(checkAdmin);

router.get("/post", async (req, res) => {
  const postDAO = new PostDAO();
  const ret = await postDAO.adminQuery(req.query);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  ret.arr = ret.arr.map((v) => v.getOriginData());
  res.send(ret);
});

router.post("/post", async (req, res) => {
  const postDAO = new PostDAO();
  const { id, obj, query, pagination } = req.body;
  const ret = await postDAO.adminUpdate(id, obj);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  const queryRet = await postDAO.adminQuery({ ...query, ...pagination });
  if (!queryRet) {
    res.status(500).send("error");
    return;
  }
  queryRet.arr = queryRet.arr.map((v) => v.getOriginData());
  res.send(queryRet);
});

router.delete("/post", async (req, res) => {
  const postDAO = new PostDAO();
  const { id, query, pagination } = req.body;
  const ret = await postDAO.deleteByID(id);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  const queryRet = await postDAO.adminQuery({ ...query, ...pagination });
  if (!queryRet) {
    res.status(500).send("error");
    return;
  }
  queryRet.arr = queryRet.arr.map((v) => v.getOriginData());
  res.send(queryRet);
});

router.get("/reply", async (req, res) => {
  const replyDAO = new ReplyDAO();
  const ret = await replyDAO.adminQuery(req.query);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  ret.arr = ret.arr.map((v) => v.getOriginData());
  res.send(ret);
});

router.post("/reply", async (req, res) => {
  const replyDAO = new ReplyDAO();
  const { id, obj, query, pagination } = req.body;
  const ret = await replyDAO.adminUpdate(id, obj);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  const queryRet = await replyDAO.adminQuery({ ...query, ...pagination });
  if (!queryRet) {
    res.status(500).send("error");
    return;
  }
  queryRet.arr = queryRet.arr.map((v) => v.getOriginData());
  res.send(queryRet);
});
module.exports = router;
