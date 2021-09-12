const { Router } = require("express");
const {
  presence_list,
  presence_get,
} = require("../../app/controllers/presenceController");
const router = (module.exports = Router());
const {
  student_list,
  student_reg,
  student_reg_end,
  apis,
  studentApi = apis,
} = require("../../app/controllers/studentController");

router.get("/", (req, res) => {
  res.render("home", {
    links: [
      { name: "Student List", href: "/student/list" },
      { name: "Presence", href: "/presence" },
    ],
  });
});

router.get("/student/list", student_list);
router.get("/student/reg", student_reg);
router.post("/api/student/reg", studentApi.student_reg_post);
router.get("/student/reg/end", student_reg_end);

router.get("/presence", presence_get);
router.get("/presence/list", presence_list);
router.get("/presence/realtime", presence_list);
