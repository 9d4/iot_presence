require("dotenv").config();

const express = require("express"),
  expressLayouts = require("express-ejs-layouts"),
  app = express(),
  port = process.env.PORT || 3000,
  http = require("http"),
  server = (exports.server = http.createServer(app)),
  websockets = require("./websockets");
/**
 * Bootstrap app
 */
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

// * setting bootstrap
/** Add default setting to db if not already set */
require("./app/core/settingBootstrap");

// * mqtt bridge
require("./app/services/MqttBridge");

// * connect db
require("./app/core/database");

// * run server
server.listen(port, () => console.log("Listening at port", port));
