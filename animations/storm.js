'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const Animation = require(path.join(paths.utils, 'animation'))
const Strike = require(path.join(paths.utils, 'strike'))
const { map } = require('missing-math')
const { hand }  = require(path.join(paths.lib, 'leap'))

module.exports = class Storm extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
    this.strikes = []
    this.lastStrike = 0
  }

  update (dt) {
    super.update(dt)
    this.clear()

    const h = hand()
    const delay = map(h.y, 0, 1, this.config.delay[0], this.config.delay[1])
    const lifetime = map(h.z, 0, 1, this.config.duration[0], this.config.duration[1])
    const color = this.config.colors[Math.floor(h.x * (this.config.colors.length - 1))]

    this.canSpawn(delay) && this.spawn({ lifetime, color })

    this.strikes.forEach(strike => {
      if (strike) {
        strike.update()
        strike.draw()
        strike.isDead && this.remove(strike)
      }
    })
  }

  canSpawn (delay) {
    return this.count > this.lastStrike + delay
        && this.strikes.length < this.config.maxStrikesLength
  }

  spawn (opts) {
    const strike = new Strike(this, opts)

    this.strikes.push(strike)
    this.lastStrike = strike.start
  }

  remove (strike) {
    strike && this.strikes.splice(strike, 1)
  }
}
