'use strict'

const path = require('path')
const { paths } = require(path.join(__dirname, '..', 'main.config.js'))

const stratum = require(path.join(paths.lib, 'stratum'))
const Animation = require(path.join(paths.utils, 'animation'))

module.exports = class Debug extends Animation {
  constructor (manager) {
    super(manager)
  }

  update (dt) {
    super.update(dt)

    stratum.clear()
    for (let x = 0; x < stratum.width; x++) {
      for (let y = 0; y < stratum.depth; y++) {
        for (let z = 0; z < stratum.height; z++) {
          stratum.set(x, y, z, [
            Math.abs(Math.sin(this.count) * 255),
            Math.abs(Math.sin(this.count + x * y) * 255),
            Math.abs(Math.sin(this.count) * 255)
          ])
        }
      }
    }
  }
}
