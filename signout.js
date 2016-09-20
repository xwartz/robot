module.exports = {
  start: function (casper) {
    var signoutUrl = 'https://github.com/'
    casper.thenOpenAndEvaluate(signoutUrl, function () {
      var form = document.forms[1]
      form.submit()
    })
  }
}
