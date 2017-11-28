'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const Animation = require(path.join(paths.utils, 'animation'))
const { Vec3 } = require('vec23')
const { map, perlin } = require('missing-math')
const { hand }  = require(path.join(paths.lib, 'leap'))
const sound  = require(path.join(paths.lib, 'sound'))

module.exports = class Cave extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
    this.camera = { x: 0, y: 0 }
  }

  update (dt) {
    super.update(dt)
    sound.enabled && this.manager.hasScrolled && sound.send('/mix', [1, this.percentVisible])

    const h = hand()
    this.camera.x += map(h.x, 0, 1, -0.01, 0.01)
    this.camera.y += h.x * this.config.camera.speed

    this.clear()
    this.terrain(h, this.camera)
    sound.enabled && this.sfx(h)
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

  sfx (h) {
    this.noteNeedChange = this.noteNeedChange || false
    this.noteIndex = this.noteIndex || 0
    this.sfxVolume = this.sfxVolume || 0

    this.targetVolume = h.isMockHand ? this.config.sound.mod[0] : this.config.sound.mod[1]
    this.sfxVolume += (this.targetVolume - this.sfxVolume) * this.config.sound.easing
    sound.send(this.config.sound.name.volume, this.sfxVolume)

    if (!h.isMockHand) {
      if (h.z < this.config.sound.thresholdZ) {
        if (this.noteNeedChange) {
          this.noteNeedChange = false
          this.noteIndex = ++this.noteIndex % this.config.sound.notes.length
          const note = this.config.sound.notes[this.noteIndex]
          sound.send(this.config.sound.name.off)
          sound.send(this.config.sound.name.on, note)
        }
      } else {
        this.noteNeedChange = true
      }
    }
  }
}
