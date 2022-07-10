const express = require("express");
const router = express.Router();
const PostDAO = require("../tools/post/PostDAO");

const totalSearchTarget = {
  POST: "POST",
  USER: "USER",
};

router.get("/", async (req, res) => {
  const { keyword, searchTarget, sortMode, skip, limit } = req.query;
  const postDAO = new PostDAO();
  switch (searchTarget) {
    case totalSearchTarget.POST: {
      let ret = await postDAO.search(decodeURI(keyword), sortMode, skip, limit);
      if (!ret) {
        res.status(500).send("error");
        return;
      }
      res.send(ret);
    }
    case totalSearchTarget.USER: {
    }
    default:
      break;
  }
});

module.exports = router;
