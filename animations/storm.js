'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const Animation = require(path.join(paths.utils, 'animation'))
const { map, clamp } = require('missing-math')
const { hand }  = require(path.join(paths.lib, 'leap'))

module.exports = class Storm extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
    this.strike = {
      start: 0
    }
  }

  update (dt) {
    super.update(dt)

    this.clear()

    const h = hand([1, 1, 1])
    const delay = map(h ? h.x : 0.5, 0, 1, this.config.delay[0], this.config.delay[1])
    const end = h
      ? map(h.z, 0, 1, this.config.duration[0], this.config.duration[1])
      : map(Math.random(), 0, 1, this.config.duration[0], this.config.duration[1])

    // console.log(delay.toFixed(2), end.toFixed(2))

    if (this.count > delay) {
      if (this.strike.start + end < this.count) {
        if (Math.random() > 0.5) this.strike.x += Math.sin(Math.random() * Math.PI * 2)
        else this.strike.y += Math.sin(Math.random() * Math.PI * 2)

        const v = Math.max(0.01, map(this.count, this.strike.start, end, 1, 0)) ** 2

        const r = v * config.white[0]
        const g = v * config.white[1]
        const b = v * config.white[2]

        for (let z = 0; z < this.height; z++) {
          this.set(this.strike.x, this.strike.y, z, [r, g, b])
        }
      } else {
        this.count = 0
        this.strike || {
          start: this.count,
          x: Math.round(Math.random() * this.width - 1),
          y: Math.round(Math.random() * this.depth - 1)
        }
      }
    }
  }
}
