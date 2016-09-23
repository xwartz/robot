var casper = require('casper')
var random = require('random-js')()
var signup = require('./src/signup')
var avatar = require('./src/avatar')
var star = require('./src/star')
var profile = require('./src/profile')
var follow = require('./src/follow')
var signout = require('./src/signout')

var sleep = function (time) {
  var stop = new Date().getTime()
  while (new Date().getTime() < stop + time) {}
}

var actions = [signup, star, profile, avatar, follow, signout]
var pageStart = function (page) {
  actions.forEach(function (action) {
    action.start(page)
  })
}

var ca = casper.create({
  verbose: true,
  logLevel: 'info',
  silentErrors: true,
  timeout: 100 * 60 * 1000,
  stepTimeout: 5 * 60 * 1000,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2866.0 Safari/537.36',
  onWaitTimeout: function () {
    this.echo('Time out', 'WARNING')
  },
  onError: function (msg) {
    this.echo(msg, 'ERROR')
  },
  pageSettings: {
    loadImages: false,
    loadPlugins: false
  }
})

ca.on('remote.message', function (msg) {
  this.echo(msg, 'COMMENT')
})

ca.start('')

var start = function (cb) {
  pageStart(ca)

  ca.on('exit', function () {
    console.log('Done!')
  })

  ca.run(function () {
    var delay = random.integer(1, 6) * 1000
    this.echo('Sleep ' + delay + 'ms', 'INFO')
    sleep(delay)
    ca.exit()
  })
}

start()
