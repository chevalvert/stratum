'use strict'

const path = require('path')
const { paths } = require(path.join(__dirname, '..', 'main.config.js'))
const Animation = require(path.join(paths.utils, 'animation'))
const Strike = require(path.join(paths.utils, 'strike'))
const { map, perlin } = require('missing-math')
const { hand } = require(path.join(paths.lib, 'leap'))
const sound = require(path.join(paths.lib, 'sound'))

module.exports = class Storm extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
    this.strikes = []
    this.lastStrike = 0
  }

  update (dt) {
    super.update(dt)
    sound.enabled && this.manager.hasScrolled && sound.send('/mix', [4, this.percentVisible])

    this.clear()

    const h = hand()
    if (!h.isMockHand) {
      const delay = map(h.z, 0, 1, this.config.delay[0], this.config.delay[1])
      const lifetime = map(Math.random(), 0, 1, this.config.duration[0], this.config.duration[1])
      this.canSpawn(delay) && this.spawn({ lifetime })
    } else {
      this.config.sky.enable && this.blinkSky(this.config.skyZ)
    }

    this.strikes.forEach(strike => {
      if (strike) {
        const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)]
        strike.update()
        strike.draw(color)
        strike.isDead && this.remove(strike)
      }
    })
  }

  blinkSky (z = 0) {
    this.nextBlink = this.nextBlink || 0
    this.skyRnd = this.skyRnd || 0
    this.skyDuration = this.skyDuration || 0

    if (this.count > this.nextBlink) {
      if (this.count > this.nextBlink + this.skyDuration) {
        const delay = map(Math.random(), 0, 1, this.config.sky.blinkDelay[0], this.config.sky.blinkDelay[1])
        this.skyDuration = map(Math.random(), 0, 1, this.config.sky.blinkDuration[0], this.config.sky.blinkDuration[1])
        this.nextBlink = this.count + delay
        this.skyRnd = Math.random() * 20
      }

      const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)]

      let xoff = Math.floor(this.count / this.skyRnd) * this.skyRnd
      for (let x = 0; x < this.width; x++) {
        xoff += this.config.sky.resolution
        let yoff = Math.floor(this.count / this.skyRnd) * this.skyRnd
        for (let y = 0; y < this.depth; y++) {
          yoff += this.config.sky.resolution
          let v = Math.max(0, Math.min(perlin(xoff, yoff) ** this.config.sky.contrast, 1))
          let c = color.map(component => component * Math.max(0.01, v * this.config.sky.opacity))
          if ((c[0] + c[1] + c[2]) / 3 > this.config.sky.displayThreshold) {
            for (let z = 0; z < this.height; z++) {
              this.set(x, y, z, c)
            }
          }
        }
      }
    }
  }

  canSpawn (delay) {
    return this.count > this.lastStrike + delay &&
        this.strikes.length < this.config.maxStrikesLength
  }

  spawn (opts) {
    const strike = new Strike(this, opts)
    sound.enabled && sound.send(this.config.sound.name, [this.config.sound.note, this.config.sound.velocity, opts.lifetime * 1000])

    this.strikes.push(strike)
    this.lastStrike = strike.start
  }

  remove (strike) {
    strike && this.strikes.splice(strike, 1)
  }
}
