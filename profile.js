var faker = require('faker')

var proUrl = 'https://github.com/settings/profile'

module.exports = {
  start: function (casper) {
    var _this = this
    casper.then(function () {
      var profile = _this.getProfile()
      _this.setProfile(casper, profile)
    })
  },

  setProfile: function (casper, profile) {
    casper.thenOpenAndEvaluate(proUrl, function (user) {
      var form = document.forms[2]
      form['user[profile_name]'].value = user.name
      form['user[profile_bio]'].value = user.bio
      form['user[profile_company]'].value = user.company
      form['user[profile_location]'].value = user.location
      form.submit()
      console.log('Then, added profile')
    }, profile)
  },

  getProfile: function () {
    return {
      name: faker.name.findName(),
      bio: faker.lorem.sentence(),
      company: faker.company.companySuffix(),
      location: faker.address.city()
    }
  }
}
