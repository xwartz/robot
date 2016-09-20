var config = require('./config')

var username = config.username

module.exports = {
  start: function (casper) {
    var folUrl = 'https://github.com/' + username
    casper.thenOpenAndEvaluate(folUrl, function () {
      var form = document.forms[4]
      form.submit()
      console.log('Then, followed')
    })
  }
}
