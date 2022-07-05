const express = require("express");
const router = express.Router();
const render = require("../tools/render");
const apiRouter = require("./api");

router.get("/", async (req, res) => {
  let ret = await render("index.html");
  res.send(ret);
});

router.use("/api", apiRouter);

module.exports = router;
