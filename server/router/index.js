const express = require("express");
const router = express.Router();
const render = require("../tools/render");
const apiRouter = require("./api");

router.get("/background", async (req, res) => {
  const ret = await render("background.html");
  res.send(ret);
});

router.get("/", async (req, res) => {
  const ret = await render("front.html");
  res.send(ret);
});


router.use("/api", apiRouter);

module.exports = router;
