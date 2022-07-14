const express = require("express");
const FavoriteDAO = require("../tools/favorite/favoriteDAO");
const { checkLogin } = require("../tools/check");
const PostDAO = require("../tools/post/PostDAO");
const router = express.Router();

router.get("/user/:userid", async (req, res) => {
  const favoriteDAO = new FavoriteDAO();
  const { userid } = req.params;
  const { skip, limit } = req.query;
  let ret = await favoriteDAO.queryByUserID(userid, skip, limit);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  let sum = await favoriteDAO.querySumByUserID(userid);
  res.send({ array: ret, sum });
});

router.post("/user/:userid/post/:postid", checkLogin, async (req, res) => {
  const favoriteDAO = new FavoriteDAO();
  const postDAO = new PostDAO();
  const { userid, postid } = req.params;
  let ret = await favoriteDAO.toggleByUserIDAndPostID(userid, postid);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  await postDAO.updateLastTimeByPostID(postid);
  res.send("OK");
});

module.exports = router;
