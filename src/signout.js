var signoutUrl = 'https://github.com/'

module.exports = {
  start: function (casper) {
    casper.thenOpenAndEvaluate(signoutUrl, function () {
      var form = document.querySelectorAll('form[action*="/logout"]')[0]
      form.submit()
    })
  }
}
