// Importing Expresse
const express = require('express')
const server = express()
const path = require('path')
const routes = require('./routes')

// Setting Template Engine
server.set('view engine', 'ejs')

// Mudar a localização da pasta views
server.set('views', path.join(__dirname, 'views'))

// Static files
server.use(express.static('public'))

// Enabling req.body
server.use(express.urlencoded({ extended: true }))

// Routes
server.use(routes)

server.listen(3000, () => console.log('Running'))
