var q = "presence.in";

var open = require("amqplib").connect(
  "amqp://smkthp:smkthp@192.168.1.10:5672/smkthp"
);

// Publisher
// open
//   .then(function (conn) {
//     return conn.createChannel();
//   })
//   .then(function (ch) {
//     return ch.assertQueue(q).then(function (ok) {
//       return ch.sendToQueue(q, Buffer.from("something to do"));
//     });
//   })
//   .catch(console.warn);

// Consumer
open
  .then(function (conn) {
    return conn.createChannel();
  })
  .then(function (ch) {
    return ch.assertQueue(q).then(function (ok) {
      return ch.consume(q, function (msg) {
        if (msg !== null) {
          console.log(msg.content.toString());
          ch.ack(msg);
        }
      });
    });
  })
  .catch(console.warn);
