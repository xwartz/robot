var fs = require('fs')
var faker = require('faker')

var avatarPath = fs.workingDirectory + '/avatar/'

var proUrl = 'https://github.com/settings/profile'

module.exports = {
  start: function (casper) {
    var _this = this
    // casper.then is important
    casper.then(function () {
      _this.getImg(casper, function (avatar) {
        _this.setAvatar(casper, avatar)
      })
    })
  },

  setAvatar: function (casper, avatar) {
    if (!avatar) return

    casper.thenOpen(proUrl, function () {
      this.echo(avatar)
      casper.page.uploadFile('#upload-profile-picture', avatar)
    })

    casper.then(function () {
      casper.waitFor(function check () {
        return this.evaluate(function () {
          return document.querySelectorAll('.js-croppable-container').length > 0
        })
      }, function then () {
        this.evaluate(function () {
          document.querySelectorAll('.js-croppable-container')[0].submit()
          console.log('Set avatar success!')
        }, function timeout () {
          this.echo('Set avatar failed..', 'COMMENT')
        })
      })
    })
  },

  getImg: function (casper, cb) {
    var url = faker.image.avatar()
    var name = url.split('/').pop()

    var avatar = avatarPath + name

    casper.thenOpen(url, function () {
      this.download(url, avatar)
    })

    casper.then(function () {
      casper.waitFor(function check () {
        return fs.exists(avatar)
      }, function then () {
        this.echo('Download avatar success!', 'COMMENT')
        cb && cb(avatar)
      }, function timeout () {
        this.echo('Download avatar failed..', 'COMMENT')
        cb && cb()
      })
    })
  }
}
