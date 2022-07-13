const express = require("express");
const UserDAO = require("../tools/user/UserDAO");
const PostDAO = require("../tools/post/PostDAO");
const PermitDAO = require("../tools/user/PermitDAO");
const PostVO = require("../tools/post/PostVO");
const ReplyVO = require("../tools/post/ReplyVO");
const ReplyDAO = require("../tools/post/replyDAO");
const { checkLogin } = require("../tools/check");
const MessageDAO = require("../tools/message/messageDAO");
const router = express.Router();

router.get("/recommend/hot", async (req, res) => {
  const postDAO = new PostDAO();
  const { skip, limit } = req.query;
  let ret = await postDAO.queryRecommendHot(skip, limit);
  if (!ret) {
    res.status(404).send("not found");
    return;
  }
  res.send(ret);
});

router.get("/recommend/new", async (req, res) => {
  const postDAO = new PostDAO();
  const { skip, limit } = req.query;
  let ret = await postDAO.queryRecommendNew(skip, limit);
  if (!ret) {
    res.status(404).send("not found");
    return;
  }
  res.send(ret);
});

router.get("/recommend/click", async (req, res) => {
  const postDAO = new PostDAO();
  const { limit } = req.query;
  const ret = await postDAO.queryLatestAndClick(limit);
  if (!ret) {
    res.status(404).send("not found");
    return;
  }
  res.send(ret);
});

router.get("/:postid/main", async (req, res) => {
  const postDAO = new PostDAO();
  const postVO = await postDAO.queryByID(req.params.postid);
  if (req.session.userInfo && req.query.click) {
    await postDAO.addClickByPostID(req.params.postid);
  }
  if (!postVO) {
    res.status(500).send("error");
    return;
  }
  res.send(postVO.getOriginData());
});

router.get("/:postid/reply", async (req, res) => {
  const postDAO = new PostDAO();
  const postVO = await postDAO.queryByID(req.params.postid);
  const { skip, limit } = req.query;
  if (!postVO) {
    res.status(500).send("error");
    return;
  }
  let arr = await postVO.getReplyBySkipAndLimit(skip, limit);
  arr = arr.map((value) => {
    return value.getOriginData();
  });
  let sum = await postVO.getReplySum();
  let ret = {
    showReplyArray: arr,
    replySum: sum,
  };

  res.send(ret);
});

router.get("/:postid/main/comment", async (req, res) => {
  const postDAO = new PostDAO();
  const postVO = await postDAO.queryByID(req.params.postid);
  const { skip, limit } = req.query;
  if (!postVO) {
    res.status(500).send("error");
    return;
  }
  let arr = await postVO.getCommentBySkipAndLimit(skip, limit);
  let ret = {
    commentArray: arr.map((value) => {
      return value.getOriginData();
    }),
    commentCount: await postVO.getCommentSum(),
  };

  res.send(ret);
});

router.get("/reply/:replyid/comment", async (req, res) => {
  const replyDAO = new ReplyDAO();
  const replyVO = await replyDAO.queryByID(req.params.replyid);
  const { skip, limit } = req.query;
  if (!replyVO) {
    res.status(500).send("error");
    return;
  }
  let arr = await replyVO.getCommentBySkipAndLimit(skip, limit);
  let ret = {
    commentArray: arr.map((value) => {
      return value.getOriginData();
    }),
    commentCount: await replyVO.getCommentSum(),
  };
  res.send(ret);
});

router.get("/user/:userid/post", async (req, res) => {
  const postDAO = new PostDAO();
  const { userid } = req.params;
  const { skip, limit } = req.query;
  let ret = await postDAO.queryByUserID(userid, skip, limit);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  ret = ret.map((value) => value.getOriginData());
  let sum = await postDAO.querySumByUserID(userid);
  res.send({ array: ret, sum });
});

router.get("/user/:userid/reply", async (req, res) => {
  const replyDAO = new ReplyDAO();
  const { userid } = req.params;
  const { skip, limit } = req.query;
  let ret = await replyDAO.queryByUserID(userid, skip, limit);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  ret = ret.map((value) => value.getOriginData());
  let sum = await replyDAO.querySumByUserID(userid);
  res.send({ array: ret, sum });
});

router.get("/user/:userid/comment", async (req, res) => {
  const replyDAO = new ReplyDAO();
  const { userid } = req.params;
  const { skip, limit } = req.query;
  let ret = await replyDAO.queryAllCommentByUserID(userid, skip, limit);
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  ret = ret.map((value) => value.getOriginData());
  let sum = await replyDAO.queryCommentSumByUserID(userid);
  res.send({ array: ret, sum });
});

router.put("/", checkLogin, async (req, res) => {
  const postDAO = new PostDAO();
  const { title, content, publisher } = req.body;
  let ret = await postDAO.createByTitleAndContentAndPublisher(
    title,
    content,
    publisher
  );
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  res.send(ret);
});

router.put("/:postid/reply", checkLogin, async (req, res) => {
  const postDAO = new PostDAO();
  const messageDAO = new MessageDAO();
  const { TotalMSGtype, TotalTargetType } = MessageDAO;
  const { publisher, content } = req.body;
  const { postid } = req.params;
  let postVO = await postDAO.queryByID(postid);
  if (!postVO) {
    res.status(500).send("error");
    return;
  }
  let insertedId = await postVO.createReplyByContentAndPublisher(
    content,
    publisher
  );

  await messageDAO.addReplyMSG(
    publisher,
    postVO.publisher._id,
    insertedId,
    TotalTargetType.REPLY
  );

  // await messageDAO.toggleMSG(
  //   publisher,
  //   postVO.publisher._id,
  //   insertedId,
  //   TotalTargetType.REPLY,
  //   TotalMSGtype.REPLY
  // );
  res.send("OK");
});

router.put("/reply/:replyid/comment", checkLogin, async (req, res) => {
  const replyDAO = new ReplyDAO();
  const messageDAO = new MessageDAO();
  const { TotalMSGtype, TotalTargetType } = MessageDAO;
  const { publisher, content, isMention, mentionID, mentionUser } = req.body;
  let replyVO = await replyDAO.queryByID(req.params.replyid);
  let insertedId = await replyVO.createCommentByContentAndPublisher(
    content,
    publisher,
    isMention,
    mentionID,
    mentionUser
  );
  if (!isMention) {
    await messageDAO.addCommentMSG(
      publisher,
      replyVO.publisher,
      insertedId,
      TotalTargetType.COMMENT
    );
  } else {
    await messageDAO.addCommentMSG(
      publisher,
      mentionUser,
      insertedId,
      TotalTargetType.COMMENT
    );
  }
  if (!insertedId) {
    res.status(500).send("error");
    return;
  }
  res.send(req.params.replyid);
});

router.post("/:postid/like", checkLogin, async (req, res) => {
  const postDAO = new PostDAO();
  const messageDAO = new MessageDAO();
  const { publisher } = req.body;
  const { postid } = req.params;
  const { TotalMSGtype, TotalTargetType } = MessageDAO;
  const postVO = await postDAO.queryByID(postid);
  let ret = await postVO.toggleLikeByPublisher(publisher);
  await messageDAO.toggleLikeMSG(
    publisher,
    postVO.publisher._id,
    postid,
    TotalTargetType.POST,
    TotalMSGtype.LIKE
  );
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  res.send(postVO.getOriginData());
});

router.post("/reply/:replyid/like", checkLogin, async (req, res) => {
  const replyDAO = new ReplyDAO();
  const messageDAO = new MessageDAO();
  const { TotalMSGtype, TotalTargetType } = MessageDAO;
  const { publisher } = req.body;
  const { replyid } = req.params;
  const replyVO = await replyDAO.queryByID(replyid);
  let ret = await replyVO.toggleLikeByPublisher(publisher);
  await messageDAO.toggleLikeMSG(
    publisher,
    replyVO.publisher,
    replyid,
    TotalTargetType.REPLY,
    TotalMSGtype.LIKE
  );
  if (!ret) {
    res.status(500).send("error");
    return;
  }
  res.send(replyVO.getOriginData());
});

// "/reply/:replyid/comment/:commentid/like"
router.post(
  "/reply/:replyid/comment/:commentid/like",
  checkLogin,
  async (req, res) => {
    const replyDAO = new ReplyDAO();
    const messageDAO = new MessageDAO();
    const { TotalMSGtype, TotalTargetType } = MessageDAO;
    const { replyid, commentid } = req.params;
    const { publisher } = req.body;
    const replyVO = await replyDAO.queryByID(replyid);
    const commentVO = await replyVO.getCommentByID(commentid);
    let ret = await commentVO.toggleLikeByPublisher(publisher);
    await messageDAO.toggleLikeMSG(
      publisher,
      commentVO.publisher,
      commentid,
      TotalTargetType.COMMENT,
      TotalMSGtype.LIKE
    );
    if (!ret) {
      res.status(500).send("error");
      return;
    }
    res.send(commentVO.getOriginData());
  }
);

module.exports = router;
