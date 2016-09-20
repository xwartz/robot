var casper = require('casper')
var random = require('random-js')()

var config = require('./config')

var signup = require('./signup')
var avatar = require('./avatar')
var star = require('./star')
var profile = require('./profile')
var follow = require('./follow')
var signout = require('./signout')

var sleep = function (time) {
  var stop = new Date().getTime()
  while (new Date().getTime() < stop + time) {
    ;
  }
}

var pageStart = function (page) {
  // sign up
  signup.start(page)

  // set avatar
  avatar.start(page)

  // star
  star.start(page)

  // set profile
  profile.start(page)

  // follow
  follow.start(page)

  // signout
  signout.start(page)
}

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
var snum = config.num

var start = function (cb) {
  if (count >= snum) {
    console.log('Done!')
    ca.exit()
    process.exit()
    return
  }

  pageStart(ca)

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
