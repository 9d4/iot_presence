const mongooseLib = require("mongoose");

exports.init = mongooseLib
  .connect(process.env.MONGODB_SERVER, {
    autoCreate: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("[mongodb] connected");
    return;
  })
  .catch((e) => {
    console.log("[mongodb] Unable to connect database");
    throw new Error(e);
  });

exports.mongoose = mongooseLib;
exports.MongoClient = mongooseLib.Connection.prototype.getClient();
