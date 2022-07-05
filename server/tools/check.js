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

module.exports = {
  checkLogin,
};
