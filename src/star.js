var config = require('../config/index.json')

var username = config.username
var repo = config.repo

module.exports = {
  start: function (casper) {
    var starUrl = 'https://github.com/' + username + '/' + repo
    casper.thenOpenAndEvaluate(starUrl, function () {
      var form = document.querySelectorAll('form[action*="/star"]')
      form.submit()
      console.log('Then, stared the repo')
    })
  }
}
