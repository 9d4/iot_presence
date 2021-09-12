const Presence = require("../models/Presence");
const moment = require("moment");
const {
  get_presence_days,
  get_classes,
} = require("../services/PresenceService");
const Student = require("../models/Student");
const { orderBy } = require("lodash");

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

    let date = moment(presences[i].date).format("YYYY-MM-DD HH:mm");
    presences[i].date = date;
  }

  if (queryDate === "today") {
    presences = await presences.filter((p) =>
      moment(p.date).local().isSame(moment(), "day") ? true : false
    );
  } else {
    if (moment(new Date(queryDate)).isValid()) {
      date = moment(queryDate).local().format();

      presences = await presences.filter((p) =>
        moment(p.date).local().isSame(moment(date), "day") ? true : false
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
    const url = req.path + "?class=" + queryClass + "&date=";

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
    const url = req.path + "?date=" + queryDate + "&class=";

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

exports.apis = {
  do_present_post: async function (req, res, next) {
    next();
  },
};
