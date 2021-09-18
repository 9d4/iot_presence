const Student = require("../models/Student");
const Presence = require("../models/Presence");
const moment = require("moment");
const { orderBy } = require("lodash");
const websockets = require("../../websockets");
const { query } = require("express");

exports.remove_duplicates = async function () {
  let presences = await Presence.find();
};

// exports.present = async function (message) {
//   // check if input is valid
//   if (!message.rfid) {
//     return "Invalid payload";
//   } else {
//     message.rfid = message.rfid.toLowerCase();
//   }

//   // check if student is registered
//   const student = (await Student.where("rfid").equals(message.rfid))[0];
//   if (!student) {
//     return "User not registered";
//   }

//   // check if already present at that day (from timestamp)
//   const presences = await Presence.where("rfid").equals(message.rfid);
//   for (let i = 0; i < presences.length; i++) {
//     const item = presences[i];

//     if ((date = item.presentToday())) {
//       return {
//         msg: `Already present today at ${
//           moment(date).local().hour() + ":" + moment(date).minute()
//         }`,
//       };
//     }

//     // if ((date = item.presentAny(req.body.timestamp))) {
//     //   return { msg: `Already present at that day: ${date}` };
//     // }
//   }

//   const p = await new Presence({
//     rfid: message.rfid,
//     date: Date.now(),
//   }).save();

//   let presence = await Presence.findOne({
//     _id: p._id,
//   }).lean();
//   presence.date = moment(presence.date).format("YYYY-MM-DD HH:mm");
//   presence.student = await exports.get_student_by_rfid(presence.rfid);

//   // Pushing to websocket clients
//   (await websockets.clients).forEach((socket) => {
//     socket.send(JSON.stringify(presence));
//   });

//   return presence;
// };

exports.present = function (message) {
  // check if input is valid
  if (!message.rfid) {
    return "Invalid payload";
  } else {
    message.rfid = message.rfid.toLowerCase();
  }

  // check if student is registered
  const found = Student.where("rfid")
    .equals(message.rfid)
    .exec()
    .then((query) => {
      if (!query[0]) {
        return Promise.reject("User not registered");
      }
      return query;
    });

  // check if already present at that day (from timestamp)
  const missing = found.then(() => {
    return Presence.where("rfid")
      .equals(message.rfid)
      .exec()
      .then((presences) => {
        for (let i = 0; i < presences.length; i++) {
          const item = presences[i];

          if ((date = item.presentToday())) {
            return Promise.reject(
              `Already present today at ${
                moment(date).local().hour() + ":" + moment(date).minute()
              }`
            );
          }
        }
        return;
      });
  });

  missing
    .then(() => {
      new Presence({
        rfid: message.rfid,
        date: Date.now(),
      })
        .save()
        .then((p) => {
          let presence = Presence.findOne({
            _id: p._id,
          }).lean();

          presence.date = moment(presence.date).format("YYYY-MM-DD HH:mm");
          presence.student = exports.get_student_by_rfid(presence.rfid);

          // Pushing to websocket clients
          websockets.clients.forEach((socket) => {
            socket.send(JSON.stringify(presence));
          });

          return presence;
        });
    })
    .catch((e) => {});

  return found;
};

exports.get_presence_days = async function () {
  // get presence dates
  let presences = await Presence.find().exec();
  let dates = [];

  await presences.forEach((p) => {
    let localDate = moment(p.date).local().format("YYYY-MM-DD");

    if (!dates.includes(localDate)) {
      dates.push(localDate);
    }
  });

  return orderBy(dates, [], ["desc"]);
};

exports.get_classes = async function () {
  let students = await Student.find().exec();
  let classes = [];

  students.forEach((student) => {
    let __class__ = student.class;

    if (!classes.includes(__class__)) {
      classes.push(__class__);
    }
  });

  return orderBy(classes, [], ["asc"]);
};

exports.get_student_by_rfid = async function (rfid) {
  return await Student.findOne({
    rfid,
  }).lean();
};
