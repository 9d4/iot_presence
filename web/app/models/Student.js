const mongoose = require("../core/database").mongoose;

const studentSchema = new mongoose.Schema(
  {
    name: String,
    rfid: { type: String, unique: true },
    nis: { type: Number },
    class: String,
  },
  { timestamps: true }
);

studentSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("There was a duplicate key error"));
  } else {
    next();
  }
});

module.exports = mongoose.model("Student", studentSchema);
