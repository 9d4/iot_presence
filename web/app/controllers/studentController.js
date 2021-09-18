const Student = require("../models/Student");
const Setting = require("../models/Setting");
const websockets = require("../../websockets");
const { orderBy } = require("lodash");

exports.student_list = async function (req, res, next) {
  let students = Student.find()
    .lean()
    .then((_students) => {
      return orderBy(_students, ["class", "name"], ["asc", "asc"]);
    })
    .then(() => {
      res.render("student-list", {
        title: "Student list",
        students,
      });
    });
};

exports.student_reg = async function (req, res, next) {
  // set setting value of registering mode
  const doc = await Setting.findOne({ name: "registering" }).exec();
  doc.value = true;
  doc.save();

  res.render("student-reg", {
    title: "Register Student",
  });
};

exports.student_reg_end = async function (req, res, next) {
  // set setting value of registering mode
  const doc = await Setting.findOne({ name: "registering" }).exec();
  doc.value = false;
  doc.save();

  (await websockets).clients.forEach((socket) => {
    socket.terminate();
  });
  res.redirect("/student/list");
};

exports.apis = {
  student_reg_post: async function (req, res, next) {
    let data = req.body;

    if (
      !(
        data.hasOwnProperty("name") &&
        data.hasOwnProperty("rfid") &&
        data.hasOwnProperty("class") &&
        data.hasOwnProperty("nis")
      )
    ) {
      res.status(400).json({
        message: "Invalid payload",
      });
    }

    const student = new Student({
      name: data.name,
      rfid: data.rfid.toLowerCase(),
      class: data.class,
      nis: data.nis,
    });

    try {
      await student.save();
      res.json({
        success: true,
        message: "Registered",
        student: student,
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  },
};
