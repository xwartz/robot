var faker = require('faker')
var random = require('random-js')()

var proUrl = 'https://github.com/settings/profile?xxxx'

module.exports = {
  start: function (casper) {
    var user = this.getProfile()
    casper.thenOpen(proUrl).thenEvaluate(function (user) {
      var form = document.forms[2]
      form['user[profile_name]'].value = user.name
      form['user[profile_bio]'].value = user.bio
      form['user[profile_company]'].value = user.company
      form['user[profile_location]'].value = user.location
      form.submit()
      console.log(user.name)
      console.log(user.bio)
      console.log(user.company)
      console.log(user.location)
      console.log('Then, added profile')
    }, user)
  },

  getProfile: function () {
    var nTypes = ['firstName', 'lastName', 'findName']
    var nType = random.pick(nTypes)

    // var bioTypes = ['word', 'words', 'sentence']
    var bioTypes = ['jobTitle', 'title', 'jobDescriptor', 'jobType']
    var bioType = random.pick(bioTypes)

    var cTypes = ['companySuffix', 'bs']
    var cType = random.pick(cTypes)

    var adTypes = ['city', 'cityPrefix', 'citySuffix', 'county', 'country']
    var adType = random.pick(adTypes)

    return {
      name: faker.name[nType](),
      // bio: faker.lorem[bioType]().slice(0, 160),
      bio: faker.name[bioType]().slice(0, 160),
      // company: faker.company[cType](),
      location: faker.address[adType]()
    }
  }
}
