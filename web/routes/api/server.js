const router = (module.exports = require("express").Router());
const Setting = require("../../app/models/Setting");
const { isRegistering } = require("../../app/services/ServerService");

router.get("/", (req, res) => {
  res.json("server api endpoint");
});

router.get("/registering", [isRegistering]);
