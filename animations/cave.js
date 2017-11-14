'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const Animation = require(path.join(paths.utils, 'animation'))
const { Vec3 } = require('vec23')
const { map, perlin } = require('missing-math')
const { hand }  = require(path.join(paths.lib, 'leap'))

module.exports = class Cave extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
    this.camera = { x: 0, y: 0 }
  }

  update (dt) {
    super.update(dt)

    const h = hand([1, 1, 1])
    this.camera.x += h ? map(h.x, 0, 1, -0.01, 0.01) : 0
    this.camera.y += this.config.camera.speed * (h ? map(h.x, 0, 1, 0, 1) : 1)

    this.clear()
    this.terrain(h || { x: 0.5, y: 0.5, z: 0.5 }, {...this.camera})
  }

  terrain (h, position) {
    const off = map(h.z, 0, 1, this.config.noise.zoff[0], this.config.noise.zoff[1])

    let xoff = position.x
    for (let x = 0; x < this.width; x++) {
      xoff += this.config.noise.resolution
      let yoff = position.y
      for (let y = 0; y < this.depth; y++) {
        yoff += this.config.noise.resolution
        let v = perlin(xoff, yoff)
        let z = map(Math.abs(v), 0, 1, 0, this.height) + (off * this.height)
        for (let zoff = 0; zoff < z; zoff++) {
          const v = Math.max(map(zoff, 0, z, 1, 0) ** 2, 0.01)
          const r = this.config.color[0] * v
          const g = this.config.color[1] * v
          const b = this.config.color[2] * v
          this.set(x, y, this.height - zoff, [r, g, b])
        }
      }
    }
  }
}