const express = require('express')
const routes = express.Router()

const views = __dirname + '/views/'

// Fake data
const Profile = {
  data: {
    name: 'Tobias',
    avatar: 'https://github.com/tobiasmarion.png',
    monthlyBudget: 100000,
    hoursPerDay: 4,
    daysPerWeek: 5,
    vacationsPerYear: 4,
    valueHour: 75
  },
  controllers: {
    index(req, res) {
      return res.render(views + 'profile', { profile: Profile.data })
    },

    update(req, res) {
      const data = req.body
      const weeksPerYear = 52
      const weeksPerMonth = (weeksPerYear - data.vacationsPerYear) / 12
      const weeklyTotalHours = data.hoursPerDay * data.daysPerWeek
      const monthlyTotalHours = weeklyTotalHours * weeksPerMonth
      data.valueHour = data.monthlyBudget / monthlyTotalHours

      Profile.data = data

      return res.redirect('/profile')
    }
  }
}

const Job = {
  data: [
    {
      id: 1,
      name: 'Pizzaria Guloso',
      dailyHours: 2,
      totalHours: 1,
      createdAt: Date.now(),
    },
    {
      id: 2,
      name: 'OneTwo Project',
      dailyHours: 3,
      totalHours: 47,
      createdAt: Date.now(),
    }
  ],

  controllers: {
    index(req, res) {
      const updatedJobs = Job.data.map((job) => {
        const remaining = Job.services.remainingDays(job)
        const status = remaining <= 0 ? 'done' : 'progress'

        return {
          ...job,
          remaining,
          status,
          budget: Job.services.calculateBudget(job, Profile.data.valueHour)
        }
      })

      return res.render(views + 'index', { updatedJobs })
    },
    save(req, res) {
      const lastId = Job.data[Job.data.length - 1]?.id || 0

      Job.data.push({
        id: lastId + 1,
        name: req.body.name,
        dailyHours: req.body.dailyHours,
        totalHours: req.body.totalHours,
        createdAt: Date.now()
      })

      return res.redirect('/')
    },
    create(req, res) {
      return res.render(views + 'job')
    },
    show(req, res) {
      const jobId = req.params.id

      const job = Job.data.find(job => job.id == jobId)

      if (!job) {
        return res.send('Job not found')
      }

      job.budget = Job.services.calculateBudget(job, Profile.data.valueHour)

      return res.render(views + 'job-edit', { job })
    },
    update(req, res) {
      const jobId = req.params.id

      const job = Job.data.find(job => job.id == jobId)

      if (!job) {
        return res.send('Job not found')
      }

      const updatedJob = {
        ...job,
        name: req.body.name,
        dailyHours: req.body.dailyHours,
        totalHours: req.body.totalHours,
      }

      Job.data = Job.data.map(job => {
        if (job.id == updatedJob.id) {
          job = updatedJob
        }
        return job

      })

      res.redirect('/job/' + job.id)
    },
    delete(req, res) {
      const jobId = req.params.id

      Job.data = Job.data.filter(job => job.id != jobId)

      return res.redirect('/')
    }
  },

  services: {
    remainingDays(job) {
      const remainingDays = Math.round(job.totalHours / job.dailyHours) //Days to finish

      const createdDate = new Date(job.createdAt) // STR Created At
      const dueDay = createdDate.getDate() + Number(remainingDays) // Finishing day
      const dueDateInMs = createdDate.setDate(dueDay) // Finishing Date in ms
      const timeDiffInMs = dueDateInMs - Date.now()

      // ms to days
      const dayInMs = 1000 * 60 * 60 * 24
      const dayDiff = Math.floor(timeDiffInMs / dayInMs)

      return dayDiff
    },
    calculateBudget: (job, valueHour) => Profile.data.valueHour * job.totalHours
  }
}


// Request & Response
// Pages (Getting data)
routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.get('/job/:id', Job.controllers.show)
routes.get('/profile', Profile.controllers.index)

// Forms (Sending data)
routes.post('/job', Job.controllers.save)
routes.post('/profile', Profile.controllers.update)
routes.post('/job/:id', Job.controllers.update)
routes.post('/job/delete/:id', Job.controllers.delete)

module.exports = routes
