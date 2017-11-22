'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const Animation = require(path.join(paths.utils, 'animation'))
const { Vec3 } = require('vec23')
const { map, perlin } = require('missing-math')
const { hand }  = require(path.join(paths.lib, 'leap'))
const sound  = require(path.join(paths.lib, 'sound'))

module.exports = class Earth extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
    this.camera = { x: 0, y: 0 }
  }

  update (dt) {
    super.update(dt)
    sound.send('/mix', [2, this.percentVisible])

    const h = hand()
    this.camera.x += map(h.x, 0, 1, -0.01, 0.01)
    this.camera.y += h.x * this.config.camera.speed

    this.clear()
    this.terrain(h, this.camera)
  }

  terrain (h, position) {
    const off = map(h.z, 0, 1, this.config.noise.zoff[0], this.config.noise.zoff[1])
    sound.send(this.config.sounds[0].name, map(h.z, 0, 1, this.config.sounds[0].mod[0], this.config.sounds[0].mod[1]))

    let count = 0
    let xoff = position.x
    for (let x = 0; x < this.width; x++) {
      xoff += this.config.noise.resolution
      let yoff = position.y
      for (let y = 0; y < this.depth; y++) {
        yoff += this.config.noise.resolution
        let v = perlin(xoff, yoff)
        let z = map(Math.abs(v), 0, 1, 0, this.height) + (off * this.height)
        for (let zoff = 0; zoff < z; zoff++) {
          this.set(x, y, zoff, [config.white[0], config.white[1], config.white[2]])
          count++
        }
      }
    }

    sound.send(this.config.sounds[1].name, map(count, 0, this.aera, this.config.sounds[1].mod[0], this.config.sounds[1].mod[1]))
  }
}
