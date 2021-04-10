const express = require('express')
const routes = express.Router()

const views = __dirname + '/views/'

const profile = {
    name: "Tobias",
    avatar: "https://avatars.githubusercontent.com/u/71554245?v=4",
    monthlyBudget: 100000,
    hoursPerDay: 4,
    daysPerWeek: 5,
    vacationsPerYear: 4
}

// Request & Response
routes.get('/', (req, res) => res.render(views + 'index'))
routes.get('/job', (req, res) => res.render(views + 'job'))
routes.get('/job/edit', (req, res) => res.render(views + 'job-edit'))
routes.get('/profile', (req, res) => res.render(views + 'profile', { profile }))


module.exports = routes