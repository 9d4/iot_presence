/**
 * Frontend stuff goes here
 */
import _ from "lodash";
import Vue from "vue";

window.app = new Vue({
  el: "#form",
  data() {
    return {
      wsStatus: "connecting",
      wsClient: null,
      formInputReady: false,
      formStatus: "Idle",
      student: {
        rfid: "",
        name: "",
        nis: "",
        class: "",
      },
    };
  },

  mounted() {
    setTimeout(() => {
      this.wsInit();
    }, 1000);
  },

  methods: {
    wsUrl() {
      const Url = window.location.origin.split("//");
      const wsProtocol = "ws://";
      if (Url[0].includes("https:")) wsProtocol = "wss://";

      return wsProtocol + Url[1] + "/websocket";
    },

    wsInit() {
      let _wsClient = (this.wsclient = new WebSocket(this.wsUrl()));
      let self = this;

      _wsClient.onopen = function (event) {
        self.wsStatus = "connected";
      };

      _wsClient.onmessage = function (event) {
        self.newCard(JSON.parse(event.data));
      };

      _wsClient.onclose = function (event) {
        self.wsStatus = "disconnected";
        setTimeout(() => {
          self.wsStatus = "redirecting...";
        }, 1000);
        setTimeout(() => {
          window.location.href = "/student/list";
        }, 3000);
      };
    },

    newCard(data) {
      if (this.formInputReady) return;

      if (data.rfid) {
        this.formStatus = "New card present";
        this.formInputReady = true;
        this.student.rfid = data.rfid;
        setTimeout(() => {
          this.$refs.elname.focus();
        }, 300);
      }
    },

    resetForm() {
      this.formInputReady = false;
      this.student = {
        rfid: "",
        name: "",
        nis: "",
        class: "",
      };

      setTimeout(() => {
        this.formStatus = "Idle";
      }, 2000);
    },

    saveStudent() {
      if (!(this.student.name && this.student.class && this.student.nis)) {
        this.formStatus = "Invalid!";
        return;
      }

      // change state
      this.formInputReady = false;
      this.formStatus = "Sending...";

      const url = window.location.origin + "/api/student/reg";
      const xhr = new XMLHttpRequest();

      xhr.open("post", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          // change state
          this.formStatus = "Sent!";
          this.resetForm();

          if (xhr.status === 400) {
            this.formStatus = "Data duplicate!";
          }
        }
      }.bind(this);

      xhr.send(JSON.stringify(this.student));
    },
  },

  computed: {},

  watch: {
    "student.name": function (newVal, oldVal) {
      this.student.name = newVal.toUpperCase();
    },
    "student.nis": function (newVal, oldVal) {
      this.student.nis = newVal.replace(/[^\d]/g, "");
    },
    "student.class": function (newVal, oldVal) {
      this.student.class = newVal.toUpperCase();
    },
  },
});
