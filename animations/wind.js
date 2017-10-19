'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const { Vec3 } = require('vec23')
const { map } = require('missing-math')

const stratum = require(path.join(paths.lib, 'stratum'))
const Particle = require(path.join(paths.utils, 'particle'))
const Animation = require(path.join(paths.utils, 'animation'))

module.exports = class Wind extends Animation {
  constructor (manager) {
    super(manager)
    this.particles = []
    for (let i = 0; i < config.animations.wind.particlesLength; i++) {
      this.particles[i] = createRandomParticle()
    }
  }

  update (dt) {
    super.update(dt)
    stratum.clear()

    this.particles.forEach((particle, index) => {
      particle.update()

      if (particle.oob && Particle.isOob(particle.lastTrail)) {
        this.particles[index] = createRandomParticle()
      }

      drawTrail(particle)
    })
  }
}

function createRandomParticle () {
  let x = - Math.random() * stratum.width
  let y = Math.random() * stratum.depth
  let z = stratum.height - 5 + Math.random() * 10
  return new Particle(x, y, z, config.animations.wind.particle)
}

function drawTrail (particle) {
  particle.trail.forEach((point, index) => {
    let v = (index / (particle.trail.length - 1))
    let r = v * config.white[0]
    let g = v * config.white[1]
    let b = v * config.white[2]
    stratum.set(point.x, point.y, point.z, [r, g, b])
  })
}
