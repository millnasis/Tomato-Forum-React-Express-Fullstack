const express = require("express");
const morgan = require("morgan");
const server = express();
const http = require("http").createServer(server);
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { uuid, dbURL } = require("./config/config");
const history = require('connect-history-api-fallback');

const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware")
const webPackConfig = require("../webpack.dev.js");

const compiler = webpack(webPackConfig);

// 将不以/api和/public开头的请求都导航到“/”
server.use(history({
  rewrites:[{
    from:/^(?!(\/api)|(\/public)).*/,
    to:"/"
  }]
}))

server.use(
  devMiddleware(compiler, {
    publicPath:"/public",
    stats: { colors: true },
  })
);

server.use(hotMiddleware(compiler))

server.use(express.json());
server.use(express.urlencoded());

server.use(morgan("tiny"));

server.use(
  session({
    secret: uuid,
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
    // 设置之后cookie只能通过https协议生效
    store: MongoStore.create({ mongoUrl: dbURL + "InternetForum" }),
    //session数据持久化
  })
);

server.set("trust proxy", 1);

server.use("/public", express.static("./public/"));

const router = require("./router/index");

server.use(router);

server.use((req, res, next) => {
  res.status(404).send("404 NOT FOUND");
});

http.listen(8000, () => {
  console.log("server running in http://localhost:8000/");
});
