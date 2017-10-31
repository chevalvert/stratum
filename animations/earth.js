'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const Animation = require(path.join(paths.utils, 'animation'))
const { Vec3 } = require('vec23')
const { map, perlin } = require('missing-math')
const { hand }  = require(path.join(paths.lib, 'leap'))

module.exports = class Earth extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
    this.camera = { x: 0, y: 0 }
  }

  update (dt) {
    super.update(dt)

    this.camera.x = Math.sin(this.count * this.config.camera.speed) * this.config.camera.radius
    this.camera.y = Math.cos(this.count * this.config.camera.speed) * this.config.camera.radius

    this.clear()
    this.terrain({...this.camera})
  }

  terrain (position) {
    const h = hand([1, 1, 1]) || { x: 0.5, y: 0.5, z: 0.5 }
    const amp = map(h.y, 0, 1, this.config.noise.amplitude[0], this.config.noise.amplitude[1])
    const res = map(h.x, 0, 1, this.config.noise.resolution[0], this.config.noise.resolution[1])
    const off = map(h.z, 0, 1, this.config.noise.zoff[0], this.config.noise.zoff[1])

    let xoff = position.x
    for (let x = 0; x < this.width; x++) {
      xoff += res
      let yoff = position.y
      for (let y = 0; y < this.depth; y++) {
        yoff += res
        let v = perlin(xoff, yoff)
        let z = map(Math.abs(v), 0, 1, 0, this.height * Math.abs(amp) + 0.00001) + (off * this.height)
        for (let zoff = 0; zoff < z; zoff++) {
          this.set(x, y, zoff, [config.white[0], config.white[1], config.white[2]])
        }
      }
    }
  }
}
