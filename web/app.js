require("dotenv").config();

const express = require("express"),
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

// * static assets
app.use("/", express.static("public/"));

app.use((req, res, next) => {
  res.locals.req = req;
  res.locals.res = res;
  next();
});

// * routes
app.use(require("./routes"));

require("./app/core/database")
  .init.then(function () {
    return require("./app/core/settingBootstrap");
  })
  .then(function () {
    return require("./app/services/AmqpBridge");
  })
  .then(function () {
    server.listen(port, () => console.log("[server] Listening at port", port));
  });

// boot.then((msg) => console.log(msg))

// run()
//   .then(() => {
//   })
//   .catch((e) => { throw e })
//   .then(() => {
//     // * connect db
//     require("./app/core/database");
//   })
//   .then(() => {
//     // * run server
//   })
//   .catch(e => {
//     throw new Error(e);
//   })
