const open = require("../core/amqpClient");
const webSocketServer = require("../../websockets");
const Setting = require("../models/Setting");
const { present } = require("./PresenceService");

const queue = "presence.in";
const jobs = {
  waitlist: [],
  isLoading: false,
  iterator: 0,
  add(val) {
    this.__jobs__.push({ i: this.iterator, val });
    this.iterator++;
    setTimeout(() => {
      this.do();
    }, 100);
  },
  rem(num) {
    for (let i = 0; i < this.__jobs__.length; i++) {
      const element = this.__jobs__[i];

      if (element.i == num) {
        this.__jobs__.splice(i, 1);
        return;
      }
    }
  },
  do(msg) {
    if (this.isLoading) {
      this.waitlist.push(msg);
    }

    // start processing
    this.isLoading = true;

    const run = function (_msg_) {
      return Setting.findOne({ name: "registering" })
        .exec()
        .then((registering) => {
          if (registering.value) {
            webSocketServer.clients.forEach((socket) => {
              socket.send(msg);
            });
          } else {
            console.log("present");
            present(JSON.parse(msg)).then(() => {
              return;
            });
          }
        });
    };

    run().then;
  },
};
// module.exports = new Promise((resolve, reject) => {
//   console.log(conn);
//   resolve();
// });

module.exports = open
  .then(function (conn) {
    return conn.createChannel().then(function (ch) {
      return ch;
    });
  })
  .then(function (ch) {
    return ch.assertQueue(queue).then(function () {
      return ch.consume(queue, function (msg) {
        if (msg !== null) jobs.do(msg.content.toString());
        ch.ack(msg);
      });
    });
  });
//   .then(function ({ registering, tag }) {
//     return new Promise((resolve) => {
//       // wait before processing message
//       setTimeout(() => {
//         jobs.forEach((msg) => {
//           console.log(msg.content.toString());
//           if (registering) {
//             webSocketServer.clients.forEach((socket) => {
//               socket.send(msg.content.toString());
//               console.log("sent");
//             });
//           }
//         });
//         resolve();
//       }, 500);
//     });
//   });

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

// setInterval(() => {
//   console.log(jobs);
//   jobs.rem(0);
// }, 5000);
