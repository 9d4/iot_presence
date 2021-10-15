require("dotenv").config();

const express = require("express"),
  session = require("express-session"),
  MongoStore = require("connect-mongo"),
  cookieParser = require("cookie-parser"),
  expressLayouts = require("express-ejs-layouts"),
  app = express(),
  port = process.env.PORT || 3000,
  http = require("http"),
  server = (exports.server = http.createServer(app)),
  websockets = require("./websockets");

// * logger
app.use(require("./app/core/logger"));

// * layout system
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "layouts/template");
app.set("views", "views");

// * utils
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// * static assets
app.use("/", express.static("public/"));

app.use((req, res, next) => {
  res.locals.req = req;
  res.locals.res = res;
  next();
});

require("./app/core/database")
  .init.then(function () {
    // * Sessions
    app.use(
      session({
        secret: process.env.APP_KEY,
        saveUninitialized: false,
        name: process.env.APP_NAME,
        resave: false,
        store: MongoStore.create({
          clientPromise: require("./app/core/database").MongoClient,
          mongoUrl: process.env.MONGODB_SERVER,
        }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 12,
        },
      })
    );

    return;
  })
  .then(function () {
    // * routes
    app.use(require("./routes"));

    return;
  })
  .then(function () {
    return require("./app/core/settingBootstrap");
  })
  .then(function () {
    return require("./app/services/AmqpBridge");
  })
  .then(function () {
    server.listen(port, () => console.log("[server] Listening at port", port));
  })
  .catch((e) => {
    console.log(e);
  });
