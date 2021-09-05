// libraries
const mqtt = require('mqtt')
const trigger = require('./trigger')

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
const client = mqtt.connect(options)



client.on('connect', function () {
    client.subscribe(subscribedTopics, function (err) {
        if (!err) {
            console.log('Connect success')
        }
    })
})

client.on('disconnect', function () {
    console.log('Connection closed! Disconnected.');
    process.exit(0);
});

client.on('message', function (topic, message) {
    console.log('======================================')

    console.log('Timestamp: ', Date.now())
    console.log('Topic    : ', topic)

    try {
        console.log('Message  : ', JSON.parse(message))

        // do trigger
        // if the message can be parsed to JSON
        // then send, else don't send message
        let subTopic = topic.split('/')   // get path of topic
        subTopic.shift();                 // remove the base topic of topics
        subTopic = subTopic.join('/')          // reassemble to string

        trigger.doTrigger(subTopic, JSON.parse(message))
    } catch {
        console.log('Can\'t parse message!')
        console.log('Showing raw data:')
        console.log(message.toString())
    }

    console.log('======================================')
    console.log()
})

