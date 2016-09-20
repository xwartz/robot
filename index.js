var fs = require('fs')
var casper = require('casper')
var faker = require('faker')

var config = require('./config')

var random = require('random-js')()

var sleep = function (time) {
  var stop = new Date().getTime()
  while (new Date().getTime() < stop + time) {
    ;
  }
}

var susername = config.username
var srepo = config.repo
var snum = config.num
var avatarPath = config.avatarPath
var avatars = fs.list(avatarPath)

// var password = config.password

var names = fs.read('fakenames.txt').toString().split('\n')
names.pop()
var mails = fs.read('email.txt').toString().split('\n')
mails.pop()

var ca = casper.create({
  verbose: true,
  logLevel: 'info',
  silentErrors: true,
  // timeout: 60000,
  stepTimeout: 60000,
  onWaitTimeout: function () {
    this.echo('Timeout')
  },
  onError: function (msg) {
    this.echo(msg)
  }
})

ca.on('remote.message', function (msg) {
  this.echo(msg, 'COMMENT')
})

var count = 0

var start = function (cb) {
  if (count >= snum) {
    console.log('Done!')
    ca.exit()
    process.exit()
    return
  }

  var emailName = random.pick(names).toLowerCase() + random.hex(4)
  var email = emailName + random.pick(mails)

  var name = faker.internet.userName().replace(/[\.\s_-]/gi, '')
  // var email = faker.internet.email()
  var password = faker.internet.password()

  var user = {
    name: name,
    email: email,
    password: password
  }

  console.log(name)

  console.log(email)

  fs.write('usedname.txt', name + ' ' + email + ' ' + password + '\n', 'a+')

  // signup
  var signupUrl = 'https://github.com/join?source=header-home'
  ca.start(signupUrl).thenEvaluate(function (user) {
    var form = document.forms[1]
    form['user[login]'].value = user.name
    form['user[email]'].value = user.email
    form['user[password]'].value = user.password
    form.submit()
    console.log('First, created a new user')
  }, user)

  // star
  var starUrl = 'https://github.com/' + susername + '/' + srepo
  ca.thenOpenAndEvaluate(starUrl, function () {
    var form = document.forms[4]
    form.submit()
    console.log('Then, stared the repo')
  })

  // profile page
  var proUrl = 'https://github.com/settings/profile'

  // set avatar
  var avatar = avatars.length && avatars.pop()
  if (avatar) {
    ca.thenOpen(proUrl, function () {
      var pa = avatarPath + avatar
      this.echo(pa)
      ca.page.uploadFile('#upload-profile-picture', pa)
    })

    ca.then(function () {
      ca.waitFor(function check () {
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

  var profile = {
    name: faker.name.findName(),
    bio: faker.lorem.sentence(),
    company: faker.company.companyName(),
    location: faker.address.city()
  }

  ca.thenOpenAndEvaluate(proUrl, function (user) {
    var form = document.forms[2]
    form['user[profile_name]'].value = user.name
    form['user[profile_bio]'].value = user.bio
    form['user[profile_company]'].value = user.company
    form['user[profile_location]'].value = user.location
    form.submit()
    console.log('Then, added profile')
  }, profile)

  // follow
  var folUrl = 'https://github.com/' + susername
  ca.thenOpenAndEvaluate(folUrl, function () {
    var form = document.forms[4]
    form.submit()
    console.log('Then, followed')
  })

  // signout
  var signoutUrl = 'https://github.com/'
  ca.thenOpenAndEvaluate(signoutUrl, function () {
    var form = document.forms[1]
    form.submit()
    // console.log('Finaly, login out')
  })

  ca.on('exit', function () {
    // exit
  })

  ca.run(function () {
    var delay = random.integer(1, 6) * 1000
    this.echo('Sleep ' + delay + 'ms', 'INFO')
    sleep(delay)
    count++
    start()
  })
}

start()
