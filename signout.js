var signoutUrl = 'https://github.com/'

module.exports = {
  start: function (casper) {
    casper.thenOpenAndEvaluate(signoutUrl, function () {
      var form = document.forms[1]
      form.submit()
    })
  }
}
