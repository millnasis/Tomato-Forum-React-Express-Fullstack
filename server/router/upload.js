const express = require("express");
const router = express.Router();
const multer = require("multer");
const { IMGstorage } = require("../config/config");

const AvatarUpload = multer({ storage: IMGstorage });
router.post("/avatar", AvatarUpload.single("avatar"), (req, res) => {
  const filename = req.file.originalname;
  console.log(filename);
  res.send(`/public/img/${filename}`);
});

module.exports = router;
