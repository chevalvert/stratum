'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', '..', 'main.config.js'))
const stratum = require(path.join(paths.lib, 'stratum'))

module.exports = class Animation {
  constructor (manager, offset) {
    this.manager = manager
    this.offset = offset

    this.width = stratum.width
    this.height = stratum.height
    this.depth = stratum.depth
    this.aera = stratum.aera

    this.count = 0
  }

  update (dt) {
    this.count += dt / 1000
  }

  clear () {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.depth; y++) {
        for (let z = this.offset - this.manager.offset; z < this.height + this.offset - this.manager.offset; z++) {
          stratum.set(x, y, z, [0, 0, 0])
        }
      }
    }
  }

  set (x, y, z, rgb = [255, 0, 255]) {
    if (z >= 0 && z <= this.height) stratum.set(x, y, z + this.offset - this.manager.offset, rgb)
  }

  drawFloor (color = [255, 255, 255]) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.depth; y++) {
        this.set(x, y, 0, color)
      }
    }
  }

  static get name () { return this.constructor.name }
  get name () { return this.constructor.name }

  get config () {
    return config.animations[this.constructor.name.toLowerCase()] || {}
  }

  get amountVisible () {
    return Math.max(0, Math.min(this.manager.offset + this.height, this.offset + this.height) - Math.max(this.manager.offset, this.offset))
  }

  get percentVisible () { return this.amountVisible / this.height }
  get isVisible () { return this.amountVisible > 0 }
}
