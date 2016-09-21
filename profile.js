var faker = require('faker')
var random = require('random-js')()

var proUrl = 'https://github.com/settings/profile'

module.exports = {
  start: function (casper) {
    var pf = this.getProfile()

    casper.thenOpen(proUrl).thenEvaluate(function (pf) {
      var form = document.forms[2]
      form['user[profile_name]'].value = pf.name
      form['user[profile_bio]'].value = pf.bio
      form['user[profile_company]'].value = pf.company
      form['user[profile_location]'].value = pf.location
      form.submit()
      console.log('Then, setted profile')
    }, pf)
  },

  getProfile: function () {
    var nTypes = ['firstName', 'lastName', 'findName']
    var nType = random.pick(nTypes)

    var bioTypes = ['word', 'words', 'sentence']
    var bioType = random.pick(bioTypes)

    var cTypes = ['companySuffix', 'bs']
    var cType = random.pick(cTypes)

    var adTypes = ['city', 'country']
    var adType = random.pick(adTypes)

    return {
      name: faker.name[nType](),
      bio: faker.lorem[bioType]().slice(0, 160),
      company: random.pick([faker.company[cType](), '', '']),
      location: faker.address[adType]()
    }
  }
}
