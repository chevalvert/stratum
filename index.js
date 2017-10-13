'use strict'

process.title = 'stratum'

const path = require('path')
const { paths, env } = require(path.join(__dirname, 'main.config.js'))

if (env === 'development') {
  require(path.join(paths.utils, 'dev-helper'))({
    // @TODO: supply stratum-viewer binaries
    viewer: '/Users/RNO/Projects/chevalvert/stratum/stratum-viewer/sketch'
  })
}

const stratum = require(path.join(paths.lib, 'stratum'))
const animations = require(path.join(paths.lib, 'animations-manager'))([
  require(path.join(paths.animations, 'debug')),
  require(path.join(paths.animations, 'rain')),
  require(path.join(paths.animations, 'wind')),
  require(path.join(paths.animations, 'earth')),
])

stratum.add(animations.update)
animations.select('earth')

stratum.start()

stratum.server.on('newnode', () => {
  !animations.running && animations.resume()
})
