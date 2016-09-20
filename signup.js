var fs = require('fs')
var faker = require('faker')
var random = require('random-js')()

// var config = require('./config')

var names = fs.read('fakenames.txt').toString().split('\n')
var mails = fs.read('email.txt').toString().split('\n')

names.pop()
mails.pop()

// var password = config.password

module.exports = {
  start: function (casper) {
    var user = this.initUser()

    var signupUrl = 'https://github.com/join?source=header-home'
    casper.start(signupUrl).thenEvaluate(function (user) {
      var form = document.forms[1]
      form['user[login]'].value = user.name
      form['user[email]'].value = user.email
      form['user[password]'].value = user.password
      form.submit()
      console.log('First, created a new user')
    }, user)
  },

  write: function (user) {
    fs.write('usedname.txt', user.name + ' ' + user.email + ' ' + user.password + '\n', 'a+')
  },

  initUser: function () {
    var emailName = random.pick(names).toLowerCase() + random.hex(4)
    var email = emailName + random.pick(mails)

    var name = faker.internet.userName().replace(/[\.\s_-]/gi, '')
    // var email = faker.internet.email()
    var password = faker.internet.password()

    // fix github password must has number
    password = /\d/gi.test(password) ? password : password + '1'

    return {
      name: name,
      email: email,
      password: password
    }
  }
}