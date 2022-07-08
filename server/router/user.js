const express = require("express");
const UserDAO = require("../tools/user/UserDAO");
const PermitDAO = require("../tools/user/PermitDAO");
const { ObjectId } = require("mongodb");
const router = express.Router();

router.post("/login", async (req, res) => {
  const userDAO = new UserDAO();
  const permitDAO = new PermitDAO();
  let condition = await permitDAO.queryByUsername(req.body.username);
  if (!condition) {
    res.status(401).send("username");
    return;
  }
  let ret = await userDAO.queryByUserPermit(
    req.body.username,
    req.body.password
  );
  if (ret) {
    req.session.userInfo = ret.getOriginData();
    res.send(ret.getOriginData());
    return;
  }
  res.status(401).send("password");
});

router.post("/register", async (req, res) => {
  const userDAO = new UserDAO();
  let condition = await userDAO.createUserByUsernameAndPassword(
    req.body.username,
    req.body.password
  );
  if (condition) {
    let ret = await userDAO.queryByUserName(req.body.username);
    req.session.userInfo = ret.getOriginData();
    res.send(ret.getOriginData());
  } else {
    res.status(401).send("userexist");
  }
});

router.post("/logout", async (req, res) => {
  if (req.session.userInfo) {
    req.session.userInfo = null;
  }
  res.send("OK");
});

router.get("/", async (req, res) => {
  if (req.session.userInfo) {
    const userDao = new UserDAO();
    // let ret = await userDao.queryByUserName(req.session.userInfo.username);
    let ret = await userDao.queryByID(req.session.userInfo.id);
    req.session.userInfo = ret.getOriginData();
    res.send(ret.getOriginData());
  } else {
    res.status(403).send("no permit");
  }
});

router.get("/:userid", async (req, res) => {
  const userDAO = new UserDAO();
  let ret = await userDAO.queryByID(req.params.userid);
  if (!ret) {
    res.redirect("/404");
    return;
  }
  if (req.session.userInfo) {
    res.send({
      userInfo: ret.getOriginData(),
      isMe: ret.getId().equals(req.session.userInfo.id),
    });
  } else {
    res.send({
      userInfo: ret.getOriginData(),
      isMe: false,
    });
  }
});

router.post("/:userid", async (req, res) => {
  const userDAO = new UserDAO();
  await userDAO.updateUserByIDAndUserInfo(req.params.userid, req.body.userInfo);
  let ret = await userDAO.queryByID(req.params.userid);
  res.send({
    userInfo: ret.getOriginData(),
    isMe: true,
  });
});

module.exports = router;
