const express = require("express");
const router = express.Router();
const PostDAO = require("../tools/post/PostDAO");
const SearchDAO = require("../tools/search/searchDAO");
const UserDAO = require("../tools/user/UserDAO");

const totalSearchTarget = {
  POST: "POST",
  USER: "USER",
};

function handleKeyword(keyword) {
  return decodeURI(keyword).split(" ");
}

router.get("/", async (req, res) => {
  const { keyword, searchTarget, sortMode, skip, limit } = req.query;
  const searchDAO = new SearchDAO();
  const decodeKeyword = handleKeyword(keyword);
  await searchDAO.recordSearchWords(decodeKeyword);
  switch (searchTarget) {
    case totalSearchTarget.POST: {
      const postDAO = new PostDAO();
      const ret = await postDAO.search(decodeKeyword, sortMode, skip, limit);
      if (!ret) {
        res.status(500).send("error");
        return;
      }
      res.send(ret);
      break;
    }
    case totalSearchTarget.USER: {
      const userDAO = new UserDAO();
      const ret = await userDAO.search(decodeKeyword, sortMode, skip, limit);
      if (!ret) {
        res.status(500).send("error");
        return;
      }
      res.send(ret);
      break;
    }
    default:
      break;
  }
});

router.get("/hot", async (req, res) => {
  const searchDAO = new SearchDAO();
  const ret = await searchDAO.getHotSearchKeyword();
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  res.send(ret);
});

module.exports = router;
