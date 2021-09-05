async function web(fastify, options) {
    fastify.get('/', async (req, reply) => {
        reply.send('ampas welcome')
    })
}

module.exports = web