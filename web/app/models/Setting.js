const mongoose = require("../core/database").mongoose;

const options = { timestamps: true };
const settingSchema = new mongoose.Schema(
  {
    name: String,
    value: Object,
  },
  options
);

module.exports = mongoose.model("Setting", settingSchema);
