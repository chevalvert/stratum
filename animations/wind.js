'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const { Vec3 } = require('vec23')
const { map } = require('missing-math')

const Particle = require(path.join(paths.utils, 'particle'))
const Animation = require(path.join(paths.utils, 'animation'))

module.exports = class Wind extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
    this.particles = []
    for (let i = 0; i < config.animations.wind.particlesLength; i++) {
      this.particles[i] = this.createRandomParticle()
    }
  }

  update (dt) {
    super.update(dt)
    this.clear()

    this.particles.forEach((particle, index) => {
      particle.update()

      if (particle.oob && Particle.isOob(particle.lastTrail)) {
        this.particles[index] = this.createRandomParticle()
      }

      this.drawTrail(particle)
    })
  }

  createRandomParticle () {
    let x = - Math.random() * this.width
    let y = Math.random() * this.depth
    let z = this.height - 5 + Math.random() * 10
    return new Particle(x, y, z, config.animations.wind.particle)
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
