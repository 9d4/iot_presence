const Student = require("../models/Student");
const Presence = require("../models/Presence");
const moment = require("moment");
const { orderBy } = require("lodash");
const websockets = require("../../websockets");
const config = require("../../config");


exports.present = function (message, timestamp = null) {
  // check if input is valid
  if (!message.rfid) {
    return "Invalid payload";
  } else {
    message.rfid = message.rfid.toLowerCase();
  }

  return (
    // check if student is registered
    Student.where("rfid")
      .equals(message.rfid)
      .exec()
      .then((query) => {
        if (!query[0]) {
          return Promise.reject("User not registered");
        }
        return query;
      })

      // check if already present at that day (from timestamp)
      .then(() => {
        return Presence.where("rfid")
          .equals(message.rfid)
          .exec()
          .then((presences) => {
            for (let i = 0; i < presences.length; i++) {
              const item = presences[i];

              if ((date = item.presentToday())) {
                return Promise.reject(
                  `Already present today at ${
                    moment(date).utcOffset(config.utcOffset).hour() +
                    ":" +
                    moment(date).minute()
                  }`
                );
              }
            }
            return;
          });
      })

      .then(() => {
        // write presence to db
        return new Presence({
          rfid: message.rfid,
          date: timestamp ?? Date.now(),
        })
          .save()

          .then((p) => {
            // get the plain json
            return Presence.findOne({
              _id: p._id,
            }).lean();
          })

          .then((presence) => {
            // get the student by rfid
            // which later will be injected into presence json
            // and send to realtime websocket
            return exports
              .get_student_by_rfid(presence.rfid)
              .then((student) => {
                return { presence, student };
              });
          })
          .then(({ presence, student }) => {
            // inject the presence json
            presence.date = moment(presence.date)
              .utcOffset(config.utcOffset)
              .format("YYYY-MM-DD HH:mm");
            presence.student = student;
            console.log(presence.date);

            // Pushing to websocket clients
            websockets.clients.forEach((socket) => {
              socket.send(JSON.stringify(presence));
            });

            return presence;
          });
        // done
      })

      .catch((e) => {
        console.log(e);
      })
  );
};

exports.get_presence_days = async function () {
  // get presence dates
  let presences = await Presence.find().exec();
  let dates = [];

  await presences.forEach((p) => {
    let localDate = moment(p.date)
      .utcOffset(config.utcOffset)
      .format("YYYY-MM-DD");

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
