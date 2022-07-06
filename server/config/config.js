const dbURL = "mongodb://localhost:27017/";
const path = require("path");
const uploadImgPath = path.join(__dirname, "../public/img");
const uploadVideoPath = path.join(__dirname, "../public/vedio");

const multer = require("multer");
let IMGstorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadImgPath);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

let Videostorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadVideoPath);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

module.exports = {
  dbURL: dbURL,
  IMGstorage: IMGstorage,
  Videostorage: Videostorage,
  uuid: "62c809c9-4271-409a-a858-a6e95921c457",
};
