'use strict'

const path = require('path')
const { paths } = require(path.join(__dirname, '..', 'main.config.js'))
const { Vec3 } = require('vec23')
const { map } = require('missing-math')

const stratum = require(path.join(paths.lib, 'stratum'))
const Particle = require(path.join(paths.utils, 'particle'))
const Animation = require(path.join(paths.utils, 'animation'))

const config = {
  particlesLength: 10,
  particle: {
    trailLength: 10,
    trailPitch: 1,
    maxSpeed: 0.1,
    // acceleration: new Vec3(0.0001, 0.00005, 0),
    acceleration: new Vec3(0.0001, 0, 0),
  }
}

module.exports = class Wind extends Animation {
  constructor (manager) {
    super(manager)
    this.particles = []
    for (let i = 0; i < config.particlesLength; i++) {
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
  let z = Math.random() * stratum.height
  return new Particle(x, y, z, config.particle)
}

function drawTrail (particle) {
  particle.trail.forEach((point, index) => {
    let v = (index / (particle.trail.length - 1)) * 255
    for (let zoff = -2; zoff < 2; zoff++) {
      stratum.set(point.x, point.y, point.z - zoff, [v, v, v])
    }
  })
}
