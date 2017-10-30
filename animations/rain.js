'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const { Vec3 } = require('vec23')
const { map } = require('missing-math')

const Particle = require(path.join(paths.utils, 'particle'))
const Animation = require(path.join(paths.utils, 'animation'))

module.exports = class Rain extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
    this.particles = []
    for (let i = 0; i < config.animations.rain.particlesLength; i++) {
      this.particles[i] = this.createRandomParticle()
    }
  }

  update (dt) {
    super.update(dt)
    this.clear()

    this.particles.forEach((particle, index) => {
      particle.update()

      if (particle.oob && particle.z < 0) {
        this.drawRipple(particle)
        if (Particle.isOob(particle.lastTrail)) {
          this.particles[index] = this.createRandomParticle()
        }
      }

      this.drawTrail(particle)
    })
  }

  createRandomParticle () {
    let x = Math.random() * this.width
    let y = Math.random() * this.depth
    let z = this.height + Math.random() * this.height
    return new Particle(x, y, z, config.animations.rain.particle)
  }

  drawRipple (particle) {
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        let v = map(particle.z, 0, -particle.trail.length, 1, 0)
        let r = v * config.white[0]
        let g = v * config.white[1]
        let b = v * config.white[2]
        this.set(particle.x + x, particle.y + y, 0, [r, g, b])
      }
    }
  }

  drawTrail (particle) {
    particle.trail.forEach((point, index) => {
      let v = (index / (particle.trail.length - 1))
      let r = v * config.white[0]
      let g = v * config.white[1]
      let b = v * config.white[2]
      this.set(point.x, point.y, point.z, [r, g, b])
    })
  }

}
