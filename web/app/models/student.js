const mongoose = require('mongoose');
// require('../core/database')

connect();

async function connect() {
    await mongoose.connect(process.env.MONGODB_SERVER)
        .catch((e) => {
            console.log('Unable to connect database');
            return e;
        })
        .then((e) => {
            if (e.code)
                console.log('Reason: ', e.code);
            else
                console.log('Database connect success');
        });
}

const studentSchema = new mongoose.Schema({
    name: String,
    rfid: String,
    created_at: Date,
    updated_at: Date,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
