const Student = require('../models/student');

async function getAllStudent(req, res, next) {
    let std = await Student.find();
    res.send(std)
}

async function newStudent(req, res, next) {
    let student = new Student({
        name: 'Dimas',
        rfid: '00 00 00 00',
        created_at: Date(),
        updated_at: Date(),
    });
    student.save();

    next();
}

async function getStudent(req, res, next) {
    // let student = await Student.where(rfidd).equals(rfid);
    // res.json(student);
}

module.exports = {
    getAllStudent,
    newStudent,
    getStudent,
};
