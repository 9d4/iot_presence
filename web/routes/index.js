const router = (module.exports = require("express").Router());

// * web routes
router.use(require("./web"));

// * api routes
router.use("/api", require("./api"));

// * fallback 404
router.use((req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});
