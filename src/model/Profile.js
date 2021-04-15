let data = {
  name: 'Tobias',
  avatar: 'https://github.com/tobiasmarion.png',
  monthlyBudget: 100000,
  hoursPerDay: 4,
  daysPerWeek: 5,
  vacationsPerYear: 4,
  valueHour: 75
}

module.exports = {
  get() {
    return data;
  },
  update(newData) {
    data = newData
  }
}