'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const Animation = require(path.join(paths.utils, 'animation'))

module.exports = class Debug extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
    this.color = [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255
    ]
  }

  update (dt) {
    super.update(dt)

    this.clear()
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.depth; y++) {
        for (let z = 0; z < this.height; z++) {
          this.set(x, y, z, this.color)
        }
      }
    }
  }
}
