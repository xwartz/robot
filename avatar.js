var fs = require('fs')
var config = require('./config')

var avatarPath = config.avatarPath
var avatars = fs.list(avatarPath)
var proUrl = 'https://github.com/settings/profile'

module.exports = {
  start: function (casper) {
    // set avatar
    var avatar = avatars.length && avatars.pop()
    if (avatar) {
      casper.thenOpen(proUrl, function () {
        var pa = avatarPath + avatar
        this.echo(pa)
        casper.page.uploadFile('#upload-profile-picture', pa)
      })

      casper.then(function () {
        casper.waitFor(function check () {
          return this.evaluate(function () {
            return document.querySelectorAll('.js-croppable-container').length > 0
          })
        }, function then () {
          this.evaluate(function () {
            document.querySelectorAll('.js-croppable-container')[0].submit()
            console.log('Setted avatar success!')
          }, function timeout () {
            this.echo('Setted avatar failed..')
          })
        })
      })
    }
  }
}
