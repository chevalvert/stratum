'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const Animation = require(path.join(paths.utils, 'animation'))
const { lerp, clamp } = require('missing-math')
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

    const delay = lerp(this.config.delay[0], this.config.delay[1], Math.random())
    if (this.count > this.lastStrike + delay && this.strikes.length < this.config.maxStrikesLength) {
      const lifetime = lerp(this.config.duration[0], this.config.duration[1], Math.random())
      this.spawn({lifetime})
    }

    this.strikes.forEach(strike => {
      this.move(strike)
      this.draw(strike)
      if (this.count > strike.end) this.remove(strike)
    })
  }

  spawn ({x, y, lifetime}) {
    this.lastStrike = this.count
    this.strikes.push({
      x: x || Math.floor(Math.random() * this.width - 1),
      y: y || Math.floor(Math.random() * this.depth - 1),
      start: this.count,
      end: this.count + lifetime,
      target: {
        x: Math.floor(Math.random() * this.width - 1),
        y: Math.floor(Math.random() * this.depth - 1)
      }
    })
  }

  move (strike) {
    const roff = Math.random() >= 0.5 ? -1 : 1
    const dirX = Math.sign(strike.target.x - strike.x) || roff
    const dirY = Math.sign(strike.target.y - strike.y) || roff

    if (Math.random() >= 0.5) strike.x = strike.x + dirX
    else strike.y = strike.y + dirY

    if (strike.x === strike.target.x && strike.y === strike.target.y) {
      strike.target = {
        x: Math.floor(Math.random() * this.width - 1),
        y: Math.floor(Math.random() * this.depth - 1)
      }
    }
  }

  draw (strike) {
    for (let z = 0; z < this.height; z++) {
      this.set(strike.x, strike.y, z, this.config.color)
    }
  }

  remove (strike) {
    strike && this.strikes.splice(strike, 1)
  }
}
