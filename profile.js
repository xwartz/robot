var faker = require('faker')
var random = require('random-js')()

var proUrl = 'https://github.com/settings/profile?xxxx'

module.exports = {
  start: function (casper) {
    var profile = this.getProfile()
    casper.thenOpen(proUrl).thenEvaluate(function (user) {
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
    var nTypes = ['firstName', 'lastName', 'findName', 'prefix', 'suffix']
    var nType = random.pick(nTypes)

    var bioTypes = ['word', 'words', 'sentence', 'sentences', 'paragraph', 'text']
    var bioType = random.pick(bioTypes)

    var cTypes = ['suffixes', 'companyName', 'companySuffix', 'bs']
    var cType = random.pick(cTypes)

    var adTypes = ['city', 'cityPrefix', 'citySuffix', 'county', 'country']
    var adType = random.pick(adTypes)

    return {
      name: faker.name[nType](),
      bio: faker.lorem[bioType](),
      company: faker.company[cType](),
      location: faker.address[adType]()
    }
  }
}
