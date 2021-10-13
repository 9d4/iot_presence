const router = (module.exports = require("express").Router());
const studentApi = require("../../app/controllers/studentController").apis;

// 
router.post("/student/reg", studentApi.student_reg_post);
