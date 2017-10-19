'use strict'

process.title = 'stratum'

const path = require('path')
const { paths, args } = require(path.join(__dirname, 'main.config.js'))

const stratum = require(path.join(paths.lib, 'stratum'))
const animations = require(path.join(paths.lib, 'animations-manager'))([
  require(path.join(paths.animations, 'debug')),
  require(path.join(paths.animations, 'rain')),
  require(path.join(paths.animations, 'wind')),
  require(path.join(paths.animations, 'earth')),
])

stratum.add(animations.update)
stratum.start()
stratum.server.on('newnode', () => {
  !animations.running && animations.resume()
})

animations.select('rain')

// -------------------------------------------------------------------------

require(path.join(paths.utils, 'dev-helper'))({
  viewer: args.with,
  onKeyPress: (str, key) => {
    if (args.keys) {
      if (key.name === 'left') return animations.previous()
      if (key.name === 'right') return animations.next()
    }
  }
})
