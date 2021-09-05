function target(uri, msg) {
    console.log("Uri: ", uri)
}

module.exports = {
    async doTrigger(uri, message) {
        target(uri, message)
    }
}