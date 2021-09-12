/**
 * This service runs along the server.
 * It triggers api call when a message from subscribed topics arrived.
 */

const webSocketServer = require("../../websockets");
const client = require("../core/mqttClient");
const Setting = require("../models/Setting");
const { present } = require("./PresenceService");
const subscribedTopics = ["presence_board/in", "presence_board/out"];

client.on("connect", function () {
  client.subscribe(subscribedTopics, function (e) {});
});

client.on("message", async (topic, message) => {
  const parsedMessage = JSON.parse(message);
  const registering = await Setting.findOne({ name: "registering" }).exec();

  // if the app state is currently set to registering,
  // send message from broker to websocket client
  if (registering.value) {
    (await webSocketServer).clients.forEach((socket) => {
      socket.send(JSON.stringify(parsedMessage));
    });
  } else {
    present(parsedMessage);
  }
});
