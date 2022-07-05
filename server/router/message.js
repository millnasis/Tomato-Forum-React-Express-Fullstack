const express = require("express");
const MessageDAO = require("../tools/message/messageDAO");
const router = express.Router();
const { checkLogin } = require("../tools/check");

router.get("/user/:userid", checkLogin, async (req, res) => {
  const messageDAO = new MessageDAO();
  const { userid } = req.params;
  const { MSGtype, skip, limit } = req.query;
  let arr = await messageDAO.queryMSGByUserIDAndMSGtype(
    userid,
    MSGtype,
    skip,
    limit
  );
  let sum = await messageDAO.queryMessageSumByUserIDAndMSGtype(userid, MSGtype);
  if (!arr) {
    res.status(500).send("error");
    return;
  }
  res.send({ array: arr, sum });
});

module.exports = router;
