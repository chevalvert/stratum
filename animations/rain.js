'use strict'

const path = require('path')
const { paths } = require(path.join(__dirname, '..', 'main.config.js'))
const { Vec3 } = require('vec23')
const { map } = require('missing-math')

const stratum = require(path.join(paths.lib, 'stratum'))
const Particle = require(path.join(paths.utils, 'particle'))
const Animation = require(path.join(paths.utils, 'animation'))

const config = {
  particlesLength: 20,
  particle: {
    trailLength: 80,
    trailPitch: 1,
    acceleration: new Vec3(0, 0, -0.01),
  }
}

module.exports = class Rain extends Animation {
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

      if (particle.oob && particle.z < 0) {
        drawRipple(particle)
        if (Particle.isOob(particle.lastTrail)) {
          this.particles[index] = createRandomParticle()
        }
      }

      drawTrail(particle)
    })
  }
}

function createRandomParticle () {
  let x = Math.random() * stratum.width
  let y = Math.random() * stratum.depth
  let z = stratum.height + Math.random() * stratum.height
  return new Particle(x, y, z, config.particle)
}

function drawRipple (particle) {
  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      let v = map(particle.z, 0, -particle.trail.length, 255, 0)
      stratum.set(particle.x + x, particle.y + y, 0, [v, v, v])
    }
  }
}

function drawTrail (particle) {
  particle.trail.forEach((point, index) => {
    let v = (index / (particle.trail.length - 1)) * 255
    stratum.set(point.x, point.y, point.z, [v, v, v])
  })
}
