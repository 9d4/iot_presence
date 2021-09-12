const mongoose = require("../core/database").mongoose;
const moment = require("moment");

/**
 * ALWAYS REMEMBER!
 * when working with moment, use local() before then chain
 * another method
 */
const presenceSchema = new mongoose.Schema({
  rfid: String,
  date: Date,
});

presenceSchema.methods.presentToday = function () {
  if (moment.utc(this.date).local().isSame(moment().local(), "day"))
    return this.date;

  return false;
};

presenceSchema.methods.presentAny = function (timestamp) {
  let _timestamp = timestamp;
  if (typeof timestamp == "string") {
    _timestamp = parseInt(timestamp);
  }

  if (moment.utc(this.date).local().isSame(moment(_timestamp).local(), "day"))
    return this.date;

  return false;
};

module.exports = mongoose.model("Presence", presenceSchema);
