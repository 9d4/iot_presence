const open = require("../core/amqpClient");
const webSocketServer = require("../../websockets");
const Setting = require("../models/Setting");
const { present } = require("./PresenceService");
const { Timestamp } = require("bson");

const queue = "presence.in";
const jobs = {
  waitlist: [],
  isLoading: false,
  iterator: 0,
  add(val) {
    this.waitlist.push({ i: this.iterator, ...val });
    this.iterator++;
  },
  rem(num) {
    for (let i = 0; i < this.waitlist.length; i++) {
      const element = this.waitlist[i];

      if (element.i == num) {
        this.waitlist.splice(i, 1);
        return;
      }
    }
  },
  do(caller) {
    this.isLoading = true;

    const __waitlist__ = this.waitlist;
    const current = __waitlist__[0]; // string

    present(JSON.parse(current.msg), current.timestamp)
      .then(() => {
        this.rem(current.i);
        return;
      })
      .then(() => {
        this.isLoading = false;
        caller.refresh();
      });
  },
};

const ival = setInterval(() => {
  if (jobs.waitlist.length > 0 && jobs.isLoading === false) {
    jobs.do(ival);
  }
}, 1 * 1000);

module.exports = open
  .then(function (conn) {
    return conn.createChannel().then(function (ch) {
      return ch;
    });
  })
  .then(function (ch) {
    return ch.assertQueue(queue).then(function () {
      return ch.consume(queue, function (msg) {
        if (msg !== null) {
          Setting.findOne({ name: "registering" })
            .exec()
            .then((registering) => {
              if (registering.value) {
                webSocketServer.clients.forEach((socket) => {
                  socket.send(msg.content.toString());
                });
              } else {
                jobs.add({
                  msg: msg.content.toString(),
                  timestamp: Date.now(),
                });
              }
            });
        }

        ch.ack(msg);
      });
    });
  });
