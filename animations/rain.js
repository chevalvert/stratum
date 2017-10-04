'use strict'

const path = require('path')
const { paths } = require(path.join(__dirname, '..', 'main.config.js'))

const stratum = require(path.join(paths.lib, 'stratum'))
const Animation = require(path.join(paths.utils, 'animation'))

const config = {
  particlesLength: 10,
}

module.exports = class Rain extends Animation {
  constructor (manager) {
    super(manager)
    this.particles = []
  }

  update (dt) {
    super.update(dt)

    stratum.clear()
    for (let x = 0; x < stratum.width; x++) {
      for (let y = 0; y < stratum.depth; y++) {
        for (let z = 0; z < stratum.height; z++) {
          let v = Math.abs(Math.sin(this.count) * 255)
          stratum.set(x, y, z, [v, v, v])
        }
      }
    }
  }
}
