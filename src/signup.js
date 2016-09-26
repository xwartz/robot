var fs = require('fs')
var faker = require('faker')
var random = require('random-js')()

var names = fs.read('fakenames.txt').toString().split('\n')
var mails = fs.read('email.txt').toString().split('\n')

names.pop()
mails.pop()

var unamePath = './usedname/list.txt'
var signupUrl = 'https://github.com/join?source=header-home'

module.exports = {
  start: function (casper) {
    var user = this.getUser()

    this.write(user)
    casper.thenOpen(signupUrl).thenEvaluate(function (user) {
      var form = document.forms[1]
      form['user[login]'].value = user.name
      form['user[email]'].value = user.email
      form['user[password]'].value = user.password
      form.submit()
      console.log('First, created a new user')
    }, user)
  },

  write: function (user) {
    console.log(user.name)
    console.log(user.email)
    fs.write(unamePath, user.name + ' ' + user.email + ' ' + user.password + '\n', 'a+')
  },

  getUser: function () {
    var prefix = random.pick(names).toLowerCase() + random.hex(4)
    var email = prefix + random.pick(mails)
    var name = faker.internet.userName().toLowerCase().replace(/[\.\s_-]/gi, '')
    // var password = faker.internet.password()
    var password = prefix

    // fix github password must has number
    password = /\d/gi.test(password) ? password : password + '1'

    return {
      name: name,
      email: email,
      password: password
    }
  }
}
