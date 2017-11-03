'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const Animation = require(path.join(paths.utils, 'animation'))

const { hand }  = require(path.join(paths.lib, 'leap'))

module.exports = class Debug extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
  }

  update (dt) {
    super.update(dt)
    this.clear()

    let pos = hand([this.width, this.depth, this.height]) || { x: this.width , y: this.depth, z: this.height / 2 }

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.depth; y++) {
        for (let z = 0; z < pos.z; z++) {
          this.set(x, y, z, [config.white[0], config.white[1], config.white[2]])
        }
      }
    }
  }
}
