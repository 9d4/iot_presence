const fastify = require('fastify')({
    logger: true,
})

fastify.register(require('./plugins/routes/web'))
fastify.register(require('./plugins/db.connector'))

async function run() {
    try {
        await fastify.listen(3000, '0.0.0.0')
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

run()