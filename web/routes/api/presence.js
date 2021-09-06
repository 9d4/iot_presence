const { Router } = require('express');
const router = Router();
const { getAllStudent, getStudent, newStudent } = require('../../app/controllers/PresenceController.js');


router.get('/student/all', getAllStudent);
router.get('/student/new', [newStudent, getStudent]);

module.exports = router;
