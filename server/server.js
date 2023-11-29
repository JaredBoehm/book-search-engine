const express = require('express')
const path = require('path')
const db = require('./config/connection')
const { authMiddleware } = require('./utils/auth')
const { ApolloServer } = require('@apollo/server')
const { typeDefs, resolvers } = require('./schemas')
const { expressMiddleware } = require('@apollo/server/express4')

const app = express()
const PORT = process.env.PORT || 3001

// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
    typeDefs,
    resolvers,
})

const startApolloServer = async () => {
    await server.start()

    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    app.use('/graphql', expressMiddleware(server, {
        context: authMiddleware
    }))

    app.use(express.static(path.join(__dirname, '../client/dist')))

    db.once('open', () => {
        app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`))
    })
}
startApolloServer()