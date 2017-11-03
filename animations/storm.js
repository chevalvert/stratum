'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const Animation = require(path.join(paths.utils, 'animation'))
const { map } = require('missing-math')
const { hand }  = require(path.join(paths.lib, 'leap'))

module.exports = class Storm extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
    this.strike = null
    this.v = 0
  }

  update (dt) {
    super.update(dt)

    this.clear()

    if (this.count > 3) {
      let nextReset = 3 + Math.random() * 3

      this.strike = this.strike || {
        x: Math.floor(Math.random() * this.width),
        y: Math.floor(Math.random() * this.depth)
      }

      if (this.count > nextReset) {
        this.strike = null
        this.count = 0
      }

      if (this.strike) {
        let x = Math.sin(Math.random() * Math.PI * 2)
        let y = Math.cos(Math.random() * Math.PI * 2)
        for (let z = 0; z < this.height; z++) {
          let v = map(this.count, 3, nextReset, 0, 1)
          let r = config.white[0] * v
          let g = config.white[1] * v
          let b = config.white[2] * v
          this.set(this.strike.x + x, this.strike.y + y, z, [r, g, b])
        }
      }
    }
  }
}
