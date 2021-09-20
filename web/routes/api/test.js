const router = (module.exports = require("express").Router());
const moment = require("moment");
const jkt = require("moment/locale/id");

router.get("/test", function (req, res) {
  let out = {};
  out.time = moment.utc("2021-09-21 23:00").utcOffset("-01:00", 0);
  out.timeform = out.time.format();
  out.jkt = moment("2021-09-21 23:00").utcOffset("+0700");
  out.jktform = out.jkt.format();

  out.diff = out.jkt.isSame(out.time, "day");

  res.json(out);
});
