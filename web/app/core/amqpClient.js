const amqplib = require("amqplib");

const host = {
  url: "localhost", // url without protocol (we use amqp by default)
  port: 5672,
  vhost: "smkthp", // empty for default vhost
  username: "smkthp",
  password: "smkthp",
};

const server = `amqp://${host.username}:${host.username}@${host.url}:${host.port}/${host.vhost}`;

let queues = []; // {queue:string, callback}
let conn = null;

const client = amqplib.connect(server).then((conn) => {
  console.log(conn);
})

function ready(conn) {

  queues.forEach(async ({ queue, callback }) => {


    conn.createChannel(async function (err, chan) {
      if (err) throw err;

      chan.assertQueue(queue);
      await chan.consume(queue, __callback__);

      async function __callback__(msg) {
        await callback(msg, chan);
      }
    });
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
