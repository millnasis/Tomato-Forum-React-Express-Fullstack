const express = require("express");
const UserDAO = require("../tools/user/UserDAO");
const PostDAO = require("../tools/post/PostDAO");
const ReplyVO = require("../tools/post/ReplyVO");
const ReplyDAO = require("../tools/post/replyDAO");
const SearchDAO = require("../tools/search/searchDAO");
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

router.delete("/reply", async (req, res) => {
  const replyDAO = new ReplyDAO();
  const { id, query, pagination } = req.body;
  const ret = await replyDAO.deleteByID(id);
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

router.post("/comments", async (req, res) => {
  const { content, id, masterID } = req.body;
  const replyDAO = new ReplyDAO();
  const replyVO = await replyDAO.queryByID(masterID);
  const ret = await replyVO.updateCommentByIDAndContent(id, content);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  res.send("OK");
});

router.delete("/comments", async (req, res) => {
  const replyDAO = new ReplyDAO();
  const { commentID, masterID, query, pagination } = req.body;
  const replyVO = await replyDAO.queryByID(masterID);
  const ret = await replyVO.deleteCommentByID(commentID);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  replyVO.comments = await replyVO.getCommentBySkipAndLimit();
  res.send(replyVO.getOriginData());
});

router.get("/user", async (req, res) => {
  const userDAO = new UserDAO();
  const ret = await userDAO.adminQuery(req.query);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  ret.arr = ret.arr.map((v) => v.getOriginData());
  res.send(ret);
});

router.post("/user", async (req, res) => {
  const userDAO = new UserDAO();
  const { id, obj, query, pagination } = req.body;
  const ret = await userDAO.adminUpdate(id, obj);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  const queryRet = await userDAO.adminQuery({ ...query, ...pagination });
  if (!queryRet) {
    res.status(500).send("error");
    return;
  }
  queryRet.arr = queryRet.arr.map((v) => v.getOriginData());
  res.send(queryRet);
});

router.delete("/user", async (req, res) => {
  const userDAO = new UserDAO();
  const { id, query, pagination } = req.body;
  const ret = userDAO.deleteUserByID(id);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  const queryRet = await userDAO.adminQuery({ ...query, ...pagination });
  if (!queryRet) {
    res.status(500).send("error");
    return;
  }
  queryRet.arr = queryRet.arr.map((v) => v.getOriginData());
  res.send(queryRet);
});

router.get("/hotsearch/normal", async (req, res) => {
  const searchDAO = new SearchDAO();
  const ret = await searchDAO.adminNormalQuery(req.query);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  res.send(ret);
});

router.post("/hotsearch/normal", async (req, res) => {
  const searchDAO = new SearchDAO();
  const { id, obj, query, pagination } = req.body;
  const ret = await searchDAO.adminNormalUpdate(id, obj);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  const queryRet = await searchDAO.adminNormalQuery({
    ...query,
    ...pagination,
  });
  if (!queryRet) {
    res.status(500).send("error");
    return;
  }
  res.send(queryRet);
});

router.put("/hotsearch/normal", async (req, res) => {
  const searchDAO = new SearchDAO();
  const { obj, query, pagination } = req.body;
  const ret = await searchDAO.adminNormalAdd(obj);
  if (!ret) {
    res.status(500).send("error");
    return;
  } else if (ret === "exist") {
    res.status(400).send(ret);
    return;
  }
  const queryRet = await searchDAO.adminNormalQuery({
    ...query,
    ...pagination,
  });
  if (!queryRet) {
    res.status(500).send("error");
    return;
  }
  res.send(queryRet);
});

router.delete("/hotsearch/normal", async (req, res) => {
  const searchDAO = new SearchDAO();
  const { id, query, pagination } = req.body;
  const ret = await searchDAO.adminNormalDelete(id);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  const queryRet = await searchDAO.adminNormalQuery({
    ...query,
    ...pagination,
  });
  if (!queryRet) {
    res.status(500).send("error");
    return;
  }
  res.send(queryRet);
});

router.get("/hotsearch/control", async (req, res) => {
  const searchDAO = new SearchDAO();
  const ret = await searchDAO.adminControlQuery();
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  res.send(ret);
});

router.post("/hotsearch/control", async (req, res) => {
  const searchDAO = new SearchDAO();
  const { arr } = req.body;
  const ret = await searchDAO.adminControlUpdate(arr);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  const queryRet = await searchDAO.adminControlQuery();
  if (!queryRet) {
    res.status(500).send("error");
    return;
  }
  res.send(queryRet);
});

router.put("/hotsearch/control", async (req, res) => {
  const searchDAO = new SearchDAO();
  const { word } = req.body;
  const ret = await searchDAO.adminControlAdd(word);
  if (!ret) {
    res.status(500).send("error");
    return;
  } else if (ret === "exist" || ret === "over") {
    res.status(400).send(ret);
    return;
  }
  const queryRet = await searchDAO.adminControlQuery();
  if (!queryRet) {
    res.status(500).send("error");
    return;
  }
  res.send(queryRet);
});

router.delete("/hotsearch/control", async (req, res) => {
  const searchDAO = new SearchDAO();
  const { word } = req.body;
  const ret = await searchDAO.adminControlDelete(word);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  const queryRet = await searchDAO.adminControlQuery();
  if (!queryRet) {
    res.status(500).send("error");
    return;
  }
  res.send(queryRet);
});

module.exports = router;
