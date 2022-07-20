const express = require("express");
const router = express.Router();
const FollowDAO = require("../tools/follow/followDAO");

router.get("/query/single", async (req, res) => {
  const followDAO = new FollowDAO();
  const { userFrom, userTo } = req.params;

  const ret = await followDAO.queryFollowIsExist(userFrom, userTo);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  res.send(ret);
});

// 我关注的
router.get("/query/group/follow/:userid", async (req, res) => {
  const followDAO = new FollowDAO();
  const { userid } = req.params;
  const { skip, limit } = req.query;
  const ret = await followDAO.queryUserFollowWhoByUserID(userid, skip, limit);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  res.send(ret);
});

// 关注我的
router.get("/query/group/befollow/:userid", async (req, res) => {
  const followDAO = new FollowDAO();
  const { userid } = req.params;
  const { skip, limit } = req.query;
  const ret = await followDAO.queryWhoFollowUserByUserID(userid, skip, limit);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  res.send(ret);
});

router.post("/add/:userid", async (req, res) => {
  if (!req.session.userInfo) {
    res.status(403).send("error");
    return;
  }
  const { userid } = req.params;
  const { id } = req.session.userInfo;
  if (userid === id) {
    res.status(403).send("error");
    return;
  }
  const followDAO = new FollowDAO();
  const ret = await followDAO.followByUserFromAndUserTo(id, userid);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  res.send(ret);
});

router.post("/delete/:userid", async (req, res) => {
  if (!req.session.userInfo) {
    res.status(403).send("error");
    return;
  }
  const { userid } = req.params;
  const { id } = req.session.userInfo;
  if (userid === id) {
    res.status(403).send("error");
    return;
  }
  const followDAO = new FollowDAO();
  const ret = await followDAO.unfollowByUserFromAndUserTo(id, userid);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  res.send(ret);
});

module.exports = router;
