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

// var password = config.password

// var names = fs.read('fakenames.txt').toString().split('\n')
// names.pop()
// var mails = fs.read('email.txt').toString().split('\n')
// mails.pop()

var ca = casper.create({
  verbose: true,
  logLevel: 'info'
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

  // var name = random.pick(names).toLowerCase() + random.hex(4)
  // var email = name + random.pick(mails)

  var name = faker.internet.userName().replace(/[\.\s_-]/gi, '')
  var email = faker.internet.email()
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
    console.log('First, create a new user')
  }, user)

  // star
  var starUrl = 'https://github.com/' + susername + '/' + srepo
  ca.thenOpenAndEvaluate(starUrl, function () {
    var form = document.forms[4]
    form.submit()
    console.log('Then, star the repo')
  })

  // follow
  var folUrl = 'https://github.com/' + susername
  ca.thenOpenAndEvaluate(folUrl, function () {
    var form = document.forms[4]
    form.submit()
    console.log('Then, follow')
  })

  // profile
  var proUrl = 'https://github.com/settings/profile'
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
    console.log('Then, add profile')
  }, profile)

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
    sleep(random.integer(3, 10) * 1000)
    count++
    start()
  })
}

start()
