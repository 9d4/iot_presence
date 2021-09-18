const amqp = require("amqplib");

const host = {
  url: process.env.AMQP_HOST, // url without protocol (we use amqp by default)
  port: process.env.AMQP_PORT,
  vhost: process.env.AMQP_VHOST, // empty for default vhost
  username: process.env.AMQP_USER,
  password: process.env.AMQP_PASS,
};

const server = `amqp://${host.username}:${host.password}@${host.url}:${host.port}/${host.vhost}`;

module.exports = amqp.connect(server).then(function (conn) {
  console.log("[amqp] connected");
  return conn;
});
