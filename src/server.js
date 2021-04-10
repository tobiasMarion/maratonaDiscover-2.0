// Importing Expresse
const express = require('express')
const server = express()
const routes = require('./routes')

// Setting Template Engine
server.set('view engine', 'ejs')

// Static files
server.use(express.static("public"))

// Routes
server.use(routes)

server.listen(3000, () => console.log('Running'))