const { Router } = require("express");
const serverRouter = Router().use("/server", require("./server"));
const studentRouter = Router().use("/student", require("./student"));
const testRouter = Router().use("/test", require("./test"));

module.exports = [
    serverRouter,
    studentRouter,
    testRouter,
]
