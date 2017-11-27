#!/usr/bin/env node
'use strict'

process.title = 'stratum'

const path = require('path')
const { paths, config, args } = require(path.join(__dirname, 'main.config.js'))

const stratum = require(path.join(paths.lib, 'stratum'))
const manager = require(path.join(paths.lib, 'animations-manager'))
const leap = require(path.join(paths.lib, 'leap'))
const sound = require(path.join(paths.lib, 'sound'))

const animations = manager.stack([
  // 'debug',
  // manager.Separator,

  'cave',
  manager.Separator,
  'earth',
  manager.Separator,
  'rain',
  manager.Separator,
  'storm',
  manager.Separator,
  'wind'
])

stratum.raf(animations.update)
stratum.start()

stratum.server.on('newnode', () => {
  if (!animations.running) {
    animations.resume()
    args.sound && initSound()
    args.timer && timer()
  }
})

function timer (ms = 0) {
  const leapTimeVisible = leap.timeVisible() || 0
  if (leapTimeVisible === 0 && ms > config.timer.minimumInterval) {
    ms = 1000
    if (Math.random() > 0.5) animations.next()
    else animations.previous()
  }

  setTimeout(() => timer(ms + 1000), 1000)
}

function initSound () {
  for (let i = 0; i <= 5; i++) sound.send('/mix', [i, 0.1])
  setInterval(() => sound.send('/play', 1), 10000)
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
