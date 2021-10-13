const { Router } = require("express");
const router = (module.exports = Router());
const {
  presence_list,
  presence_get,
  presence_not_present_list,
} = require("../../app/controllers/presenceController");
const {
  student_list,
  student_reg,
  student_reg_end,
  apis,
  studentApi = apis,
} = require("../../app/controllers/studentController");
const { loggedIn } = require("../../app/middleware/auth");
const Setting = require("../../app/models/Setting");

router.use(async function (req, res, next) {
  const regmode = await Setting.findOne({ name: "registering" }).exec();
  res.locals.regmode = regmode.value;
  next();
});

router.use(async function (req, res, next) {
  if (req.session.loggedIn) res.locals.loggedIn = true;
  else res.locals.loggedIn = false;

  next();
});

router.get("/", async (req, res) => {
  res.render("home", {
    links: [
      { name: "Student List", href: "/student/list" },
      { name: "Presence", href: "/presence" },
    ],
  });
});

// * Auth Routes
router.use(require("./auth"));

// * Student Routes
const studentRouter = Router();
router.use("/student", studentRouter);
studentRouter.use(loggedIn);

studentRouter.get("/list", student_list);
studentRouter.get("/reg", student_reg);
studentRouter.get("/reg/end", student_reg_end);

// * Presence Routes
const presenceRouter = Router();
router.use("/presence", presenceRouter);
presenceRouter.use(loggedIn);

presenceRouter.get("/", presence_get);
presenceRouter.get("/list", presence_list);
presenceRouter.get("/realtime", presence_list);
presenceRouter.get("/no", presence_not_present_list);
