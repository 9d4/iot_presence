const mongoose = require('mongoose');

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
