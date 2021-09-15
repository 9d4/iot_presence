const amqplib = require("amqplib/callback_api");

const host = {
  url: "localhost", // url without protocol (we use amqp by default)
  port: 5672,
  vhost: "smkthp", // empty for default vhost
  username: "smkthp",
  password: "smkthp",
};

const server = `amqp://${host.username}:${host.username}@${host.url}:${host.port}/${host.vhost}`;

let queues = []; // {queue:string, callback}

const client = amqplib.connect(server, function (err, __conn__) {
  if (err) throw err;
  else {
    console.log("[amqp] connected");
  }

  ready(__conn__); // trigger ready
});

function ready(conn) {
  queues.forEach(({ queue, callback }) => {
    consume(conn, queue, callback);
  });
}

let previousMsg = "";

function consume(conn, queue, callback) {
  conn.createChannel(function (err, chan) {
    if (err) throw err;

    chan.assertQueue(queue);
    chan.consume(queue, __callback__);

    function __callback__(msg) {
      if (previousMsg !== msg.content) callback(msg, chan);

      previousMsg = msg.content;
    }
  });
}

/**
 * @callback onMessageCallback
 * @param {string} queue
 * @param {*} callback
 */

/**
 * @param {string} queue
 * @param {onMessageCallback} callback
 */
function onMessage(queue, callback) {
  queues.push({ queue, callback });
}

module.exports = { client, onMessage };
