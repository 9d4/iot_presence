const WebSocket = require("ws");
const server = require("../app").server;

const webSocketServer = (module.exports = new WebSocket.Server({
  server,
  path: "/websocket",
}));
