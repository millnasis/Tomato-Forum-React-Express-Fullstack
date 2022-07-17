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

module.exports = router;
