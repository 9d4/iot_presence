const mongooseLib = require("mongoose");
const mongoClient = require("mongodb").MongoClient;

mongooseLib
  .connect(process.env.MONGODB_SERVER, {
    autoCreate: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((e) => {
    console.log("Unable to connect database");
    process.exit(1);
  });

mongooseLib.a = "not a";

const mongodb = {
  db: null,
  connect(callback) {
    mongoClient.connect(process.env.MONGODB_SERVER, (err, database) => {
      if (err) throw err;
      this.db = database;
    });
  },
  get() {
    return this.db;
  },
  close() {
    this.db.close();
  },
};

exports.mongoose = mongooseLib;
