const Profile = require('../model/Profile')

module.exports =  {
  index(req, res) {
    return res.render('profile', { profile: Profile.get() })
  },

  update(req, res) {
    const data = req.body
    const weeksPerYear = 52
    const weeksPerMonth = (weeksPerYear - data.vacationsPerYear) / 12
    const weeklyTotalHours = data.hoursPerDay * data.daysPerWeek
    const monthlyTotalHours = weeklyTotalHours * weeksPerMonth
    data.valueHour = data.monthlyBudget / monthlyTotalHours

    Profile.update(data)

    return res.redirect('profile')
  }
}
