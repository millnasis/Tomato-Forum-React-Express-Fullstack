const express = require("express");
const router = express.Router();
const multer = require("multer");
const { IMGstorage, Videostorage } = require("../config/config");

const IMGUpload = multer({ storage: IMGstorage });
const VideoUpload = multer({ storage: Videostorage });
router.post("/avatar", IMGUpload.single("avatar"), (req, res) => {
  const filename = req.file.originalname;
  console.log(filename);
  res.send(`/public/img/${filename}`);
});

router.post("/img", IMGUpload.single("img"), (req, res) => {
  const filename = req.file.originalname;
  res.send({
    errno: 0,
    data: {
      url: `/public/img/${filename}`,
    },
  });
});

router.post("/video",VideoUpload.single("video"),(req,res)=>{
  const filename = req.file.originalname;
  res.send({
    errno: 0,
    data: {
      url: `/public/video/${filename}`,
    },
  });
});

module.exports = router;
