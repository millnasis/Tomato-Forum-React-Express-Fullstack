const express = require("express");
const UserDAO = require("../tools/user/UserDAO");
const PermitDAO = require("../tools/user/PermitDAO");
const db = require("../tools/db");
const userAPI = require("./user");
const postAPI = require("./post");
const uploadAPI = require("./upload");
const favoriteAPI = require("./favorite");
const messageAPI = require("./message");
const searchAPI = require("./search");
const followAPI = require("./follow");
const adminAPI = require("./admin");
const router = express.Router();

router.use("/user", userAPI);

router.use("/post", postAPI);

router.use("/upload", uploadAPI);

router.use("/favorite", favoriteAPI);

router.use("/message", messageAPI);

router.use("/search", searchAPI);

router.use("/follow", followAPI);

router.use("/admin", adminAPI);

module.exports = router;
