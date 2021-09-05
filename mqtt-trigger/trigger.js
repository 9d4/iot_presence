async function target(subTopic, msg) {

}

module.exports = {
    async doTrigger(subTopic, message) {
        target(subTopic, message)
    }
}