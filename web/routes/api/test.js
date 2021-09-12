const router = (module.exports = require("express").Router());
const moment = require("moment");
const Presence = require("../../app/models/Presence");
const Setting = require("../../app/models/Setting");
const { get_classes } = require("../../app/services/PresenceService");

router.get("/test", async function (req, res) {
  res.json(await get_classes());
});
