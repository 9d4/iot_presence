// libraries
require('dotenv').config();
const mqtt = require('mqtt');
const trigger = require('./trigger');

// others
const options = {
    host: 'localhost',
    port: 1883,
    username: 'admin',
    password: 'admin',
    clientId: 'mqtt-trigger_local',
}
const subscribedTopics = [
    'presence_board/in',
    'presence_board/out',
]

// ===========
// mqtt client
const client = mqtt.connect(options);


client.on('connect', function () {
    client.subscribe(subscribedTopics, function (e) {
        if (e) {
            console.log(e)
        } else {
            console.log('connected');
        }
    })
})

client.on('disconnect', function () {
    console.log('Connection closed! Disconnected.');
    process.exit(0);
});

client.on('message', function (topic, message) {
    if (global.typing) {
        return
    }

    console.log('======================================')
    console.log('Timestamp: ', Date.now())
    console.log('Topic    : ', topic)


    try {
        console.log('Message  : ', JSON.parse(message))

        // do trigger
        // if the message can be parsed to JSON
        // then send, else don't send message

    } catch {
        console.log('Can\'t parse message!')
        console.log('Showing raw data:')
        console.log(message.toString())
    }
    trigger(topic, JSON.parse(message))

    console.log('======================================')
})

