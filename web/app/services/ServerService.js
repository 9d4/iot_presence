const Setting = require("../models/Setting");

exports.isRegistering = async function (req, res) {
  // get value from db
  const registering = await Setting.findOne({ name: "registering" }).exec();

  if (registering) {
    return res.json(registering.value);
  }

  res.status(404).json("not found");
};
