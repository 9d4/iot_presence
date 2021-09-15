const client = require("../core/amqpClient");
const webSocketServer = require("../../websockets");
const Setting = require("../models/Setting");
const { present } = require("./PresenceService");

client.onMessage("presence.in", bridge_init);

function bridge_init(msg, chan) {
  if (msg !== null) {
    // do things to system
    const parsedMessage = JSON.parse(msg.content.toString());
    const registering = Setting.findOne({ name: "registering" }).exec();

    // if the app state is currently set to registering,
    // send message from broker to websocket client
    if (registering.value) {
      webSocketServer.clients.forEach((socket) => {
        socket.send(JSON.stringify(parsedMessage));
      });
    } else {
      present(parsedMessage);
    }

    chan.ack(msg);
  }
}
