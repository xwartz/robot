var config = require('../config/index.json')

var folUrl = 'https://github.com/' + config.username

module.exports = {
  start: function (casper) {
    casper.thenOpen(folUrl).thenEvaluate(function () {
      var form = document.querySelectorAll('form[action*="/users/follow"]')[0]
      form.submit()
      console.log('Then, followed')
    })
  }
}
