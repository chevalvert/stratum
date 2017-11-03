'use strict'

process.title = 'stratum'

const path = require('path')
const { paths, config, args } = require(path.join(__dirname, 'main.config.js'))

const stratum = require(path.join(paths.lib, 'stratum'))
const manager = require(path.join(paths.lib, 'animations-manager'))
const leap = require(path.join(paths.lib, 'leap'))

const animations = manager([
  require(path.join(paths.animations, 'debug')),
  require(path.join(paths.animations, 'cave')),
  require(path.join(paths.animations, 'earth')),
  require(path.join(paths.animations, 'rain')),
  require(path.join(paths.animations, 'storm')),
])

stratum.add(animations.update)
stratum.start()
stratum.server.on('newnode', () => {
  if (!animations.running) {
    animations.resume()
    args.leap && timer()
  }
})

function timer (seconds = 0) {
  const leapTimeVisible = leap.timeVisible() || 0

  if (leapTimeVisible === 0 && seconds > config.secondsBeforeSkip) {
    seconds = -1

    if (Math.random() > 0.5) animations.next()
    else animations.previous()
  }

  setTimeout(() => timer(++seconds), 1000)
}



// -------------------------------------------------------------------------

require(path.join(paths.utils, 'dev-helper'))({
  viewer: args.with,
  onKeyPress: (str, key) => {
    if (args.keys) {
      if (key.name === 'left') return animations.previous()
      if (key.name === 'right') return animations.next()
      if (key.name === 'up') return animations.offset++
      if (key.name === 'down') return animations.offset--
    }
  }
})
