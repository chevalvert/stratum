'use strict'

process.title = 'stratum'

const path = require('path')
const { paths, env } = require(path.join(__dirname, 'main.config.js'))

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

if (env === 'development') {
  require(path.join(paths.utils, 'dev-helper'))({
    // @TODO: supply stratum-viewer binaries
    viewer: '/Users/RNO/Projects/chevalvert/stratum/stratum-viewer/sketch',
    onKeyPress: (str, key) => {
      if (key.name === 'left') return animations.previous()
      if (key.name === 'right') return animations.next()
    }
  })
}
