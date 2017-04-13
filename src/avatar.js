var fs = require('fs')
// var faker = require('faker')
// var random = require('random-js')()

var avatarPath = fs.workingDirectory + '/avatar/'

var proUrl = 'https://github.com/settings/profile'

module.exports = {
  start: function (casper) {
    var _this = this
    // This then is important!
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
      casper.page.uploadFile('input[type="file"]', avatar)
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
        }, 10000)
      })
    })
  },

  getImg: function (casper, cb) {
    // var types = [
    //   'avatar', 'image', 'abstract',
    //   'animals', 'cats', 'city',
    //   'fashion', 'people', 'nature',
    //   'sports', 'technics', 'transport'
    // ]
    // var type = random.pick(types)
    // var url = faker.image[type]()
    // var url = 'http://lorempixel.com/200/200/'
    // var url = 'http://loremflickr.com/200/200/?random'
    var url = 'https://unsplash.it/200/200/?random'

    var avatar = avatarPath + 'avatar.jpg'

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
