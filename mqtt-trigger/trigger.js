const argv = process.argv;
const http = require('http');
const prompt = require('prompt');

function target(topic, msg) {
    regmode = argv.includes('--reg')

    const options = {
        host: process.env.HOST,
        path: regmode ? process.env.REG_URI : process.env.IN_URI,
        port: process.env.PORT,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    if (regmode) {
        let data = {
            rfid: msg.rfid,
            timestamp: Date.now(),
        }

        // ask name
        prompt.start();
        prompt.get(['name'], function (err, result) {
            data.name = result.name;
            console.log(result);

        });

        data = JSON.stringify(data);
        options.headers['Content-Length'] = data.length;

        let req = http.request(options, function (res) {
            let body = "";

            res.on('data', (chunk) => {
                body += chunk;
            })

            res.on('end', () => {
                console.log(body);
            })
        })


        req.write(data);
        req.end();

        console.log('Registered')
        return;
    }

    if (topic == 'presence_board/in') {
        const data = JSON.stringify({
            rfid: msg.rfid,
            timestamp: Date.now(),
        })

        options.headers['Content-Length'] = data.length;

        let req = http.request(options, function (res) {
            let body = "";

            res.on('data', (chunk) => {
                body += chunk;
            })

            res.on('end', () => {
                console.log(body);
            })
        })

        req.write(data)
        req.end();
    }
}

module.exports = target
