const mqtt = require("mqtt");

// options
const options = {
  host: "localhost",
  port: 1883,
  username: "admin",
  password: "admin",
  clientId: "mqtt-web_local",
};

// ===========
// mqtt client
const client = (module.exports = mqtt.connect(options));
