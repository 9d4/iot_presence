const router = (module.exports = require("express").Router());
const studentApi = require("../../app/controllers/studentController").apis;
const { loggedIn } = require("../../app/middleware/auth");

//
router.use(loggedIn);
router.post("/reg", studentApi.student_reg_post);
