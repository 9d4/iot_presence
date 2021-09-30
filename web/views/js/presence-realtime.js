import Vue from "vue";

new Vue({
  el: "#app",
  data: {
    wsStatus: "connecting...",
    presences: [],
  },
  mounted() {
    this.presences = JSON.parse(
      Buffer.from(window.presences, "base64").toString("binary")
    );
    this.wsInit();
  },
  methods: {
    wsUrl() {
      const basUrl = window.location.origin.split("//")[1];
      return "wss://" + basUrl + "/websocket";
    },

    wsInit() {
      let _wsClient = (this.wsclient = new WebSocket(this.wsUrl()));
      let self = this;

      _wsClient.onopen = function (event) {
        self.wsStatus = "connected";
      };

      _wsClient.onmessage = function (event) {
        self.newPresence(JSON.parse(event.data));
      };

      _wsClient.onclose = function (event) {
        self.wsStatus = "disconnected";
        setTimeout(() => {
          self.wsStatus = "reconnecting...";
        }, 1000);
        setTimeout(() => {
          self.wsInit(); //reconnect
        }, 3000);
      };
    },

    newPresence(data) {
      if (this.presences.length === 255) {
        this.presences.pop();
      }

      this.presences.unshift(data);
    },
  },
});
