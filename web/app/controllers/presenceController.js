const Presence = require("../models/Presence");
const moment = require("moment");
const {
  get_presence_days,
  get_classes,
  get_student_by_rfid,
} = require("../services/PresenceService");
const Student = require("../models/Student");
const { orderBy } = require("lodash");
const { nanoid } = require("nanoid");
const config = require("../../config");

/**
 * function present_list
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.presence_list = async function (req, res, next) {
  let presences = orderBy(
    await Presence.find().lean(),
    ["date", "class"],
    ["desc", "asc"]
  );
  let leftContents = [];
  let filters = [];
  const queryDate = req.query.date;
  const queryClass = req.query.class;

  // inject presences with student object
  // translate date
  for (let i = 0; i < presences.length; i++) {
    presences[i].student = await Student.findOne({
      rfid: presences[i].rfid,
    }).lean();

    let date = moment
      .utc(presences[i].date)
      .utcOffset(config.utcOffset)
      .format("YYYY-MM-DD HH:mm");
    presences[i].date = date;
  }

  if (queryDate === "today") {
    presences = await presences.filter((p) => {
      const today = moment().utcOffset(config.utcOffset);
      const presence_date = moment(p.date).utcOffset(config.utcOffset);
      return presence_date.isSame(today, "day");
    });
  } else {
    if (moment(new Date(queryDate)).isValid()) {
      date = moment(queryDate).utcOffset(config.utcOffset, true).format();

      presences = await presences.filter((p) =>
        moment(p.date).utcOffset(config.utcOffset).isSame(moment(date), "day")
          ? true
          : false
      );
    }
  }

  if (queryDate) {
    filters.push({ name: "date", value: queryDate });
  }

  if (queryClass) {
    presences = await presences.filter((p) => p.student.class === queryClass);

    filters.push({ name: "class", value: queryClass });
  }

  if (queryClass && Object.keys(req.query).length === 1) {
    let presenceDates = [];
    const url =
      req.originalUrl.split("?")[0] + "?class=" + queryClass + "&date=";

    presences.forEach((p) => {
      let __date__ = moment(p.date).format("YYYY-MM-DD");

      if (!presenceDates.includes(__date__)) {
        leftContents.push({ link: url + __date__, content: __date__ });
        presenceDates.push(__date__);
      }
    });

    leftContents.title = "Filter Date";
  }

  if (queryDate && Object.keys(req.query).length === 1) {
    let classes = await get_classes();
    const url =
      req.originalUrl.split("?")[0] + "?date=" + queryDate + "&class=";

    classes.forEach((__class__) => {
      leftContents.push({ link: url + __class__, content: __class__ });
    });

    leftContents.title = "Filter Class";
  }

  if (req.path.split("/")[req.path.split("/").length - 1] === "realtime") {
    return res.render("presence-realtime", {
      title: "Presence List",
      presences: Buffer.from(JSON.stringify(presences), "binary").toString(
        "base64"
      ),
      leftContents,
      filters,
    });
  }

  res.render("presence-list", {
    title: "Presence List",
    presences,
    leftContents,
    filters,
  });
};

exports.presence_get = async function (req, res, next) {
  const dates = await get_presence_days();
  const classes = await get_classes();

  res.render("presence", { dates, classes });
};

exports.presence_not_present_list = async function (req, res, next) {
  const presenceDates = await get_presence_days();
  const students = await Student.find().lean();
  let output = [];
  let students_rfid = [];

  students.forEach((student) => {
    students_rfid.push(student.rfid);
  });

  console.log(students_rfid);
  for (let i = 0; i < presenceDates.length; i++) {
    const currentDate = moment(presenceDates[i]).local();
    const presences = await (
      await Presence.find().lean()
    ).filter((p) => moment.utc(p.date).local().isSame(currentDate, "day"));
    let presents_rfid = [];
    let not_presents = [];

    for (let j = 0; j < presences.length; j++) {
      const p = presences[j];
      presents_rfid.push(p.rfid);
    }

    for (let j = 0; j < students_rfid.length; j++) {
      if (!presents_rfid.includes(students_rfid[j])) {
        not_presents.push(await get_student_by_rfid(students_rfid[j]));
      }
    }

    output.push({
      id: nanoid(),
      date: currentDate.format("YYYY-MM-DD"),
      students: not_presents,
    });
  }

  console.log(output);
  res.render("presence-no", { data: output });
};
