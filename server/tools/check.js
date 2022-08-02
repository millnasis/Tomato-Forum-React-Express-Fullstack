const UserDAO = require("./user/UserDAO");
const PostDAO = require("./post/PostDAO");
const PermitDAO = require("./user/PermitDAO");
const PostVO = require("./post/PostVO");
const ReplyVO = require("./post/ReplyVO");
const ReplyDAO = require("./post/replyDAO");

async function checkLogin(req, res, next) {
  if (!req.session.userInfo) {
    res.status(403).send("no permit");
    return;
  } else {
    next();
  }
}

async function checkAdmin(req, res, next) {
  if (!req.session.userInfo) {
    res.status(403).send("no permit");
    return;
  }
  const permitDAO = new PermitDAO();
  const ret = await permitDAO.queryAdminPermit(req.session.userInfo.id);
  if (!ret) {
    res.status(403).send("no permit");
    return;
  }
  next();
}

module.exports = {
  checkLogin,
  checkAdmin,
};
