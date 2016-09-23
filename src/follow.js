var config = require('../config.json')

var folUrl = 'https://github.com/' + config.username

module.exports = {
  start: function (casper) {
    casper.thenOpen(folUrl).thenEvaluate(function () {
      var form = document.forms[4]
      form.submit()
      console.log('Then, followed')
    })
  }
}
