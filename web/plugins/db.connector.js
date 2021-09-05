// const fastifyPlugin = require('fastify-plugin')

// async function dbConnector(fastify, options) {
//     fastify.register(require('fastify-mongodb'), {
//         url: 'mongodb://traper:sutelo09@localhost:27017/traper'
//     })
// }

// module.exports = fastifyPlugin(dbConnector)


const fastifyPlugin = require('fastify-plugin')

async function dbConnector (fastify, options) {
  fastify.register(require('fastify-mongodb'), {
    url: 'mongodb://localhost:27017/test_database'
  })
}

// Wrapping a plugin function with fastify-plugin exposes the decorators    
// and hooks, declared inside the plugin to the parent scope.
module.exports = fastifyPlugin(dbConnector)
