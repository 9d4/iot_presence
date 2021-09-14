const mqtt = require("mqtt");

// options
// const options = {
//   host: "localhost",
//   port: 1883,
//   username: "admin",
//   password: "admin",
//   clientId: "mqtt-web_local",
// };
const options = {
  host: "mqtts://mqtt.flespi.io:8883/",
  // port: 8883,
  username: "FlespiToken Hj52qaUrgbI1AIDRwUmAeJclaWhenyfUI8MY8ufduL4UjxBDgN3kl5tlQBn3XqLv",
  password: "",
  clientId: "mqtt-web_local",
  rejectUnauthorized: false,
};

// ===========
// mqtt client
const client = (module.exports = mqtt.connect("mqtts://mqtt.flespi.io:8883", options));
