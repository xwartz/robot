var signoutUrl = 'https://github.com/'

module.exports = {
  start: function (casper) {
    casper.thenOpen(signoutUrl).thenEvaluate(function () {
      var form = document.querySelectorAll('form[action*="/logout"]')[0]
      form.submit()
    })
  }
}
