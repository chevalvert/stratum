'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const { Vec3 } = require('vec23')
const { map } = require('missing-math')
const { hand }  = require(path.join(paths.lib, 'leap'))

const Particle = require(path.join(paths.utils, 'particle'))
const Animation = require(path.join(paths.utils, 'animation'))

module.exports = class Rain extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
    this.particles = []
    for (let i = 0; i < this.config.particlesLength[0]; i++) {
      this.particles[i] = this.createRandomParticle()
    }
  }

  update (dt) {
    super.update(dt)
    this.clear()

    const h = hand([1, 1, 1]) || { x: 0.5, y: 0.5, z: 0.5 }
    const particlesLength = map(h.x, 0, 1, this.config.particlesLength[0], this.config.particlesLength[1])
    const maxSpeed = map(h.y, 0, 1, this.config.particle.maxSpeed[0], this.config.particle.maxSpeed[1])
    const trailLength = map(h.z, 0, 1, this.config.particle.trailLength[0], this.config.particle.trailLength[1])

    const particleOpts = {
      ...this.config.particle,
      maxSpeed,
      trailLength: trailLength | 0
    }

    if (this.particles.length < particlesLength) {
      for (let i = 0; i < particlesLength - this.particles.length; i++) {
        this.particles.push(this.createRandomParticle(particleOpts))
      }
    }

    this.particles.forEach((particle, index) => {
      particle.opts.maxSpeed = maxSpeed
      particle.opts.trailLength = trailLength
      particle.update()

      if (particle.oob && particle.z < 0) {
        if (this.config.ripples) this.drawRipple(particle)
        if (Particle.isOob(particle.lastTrail)) {
          if (index < particlesLength) {
            this.particles[index] = this.createRandomParticle(particleOpts)
          } else this.particles.splice(index, 1)
        }
      }

      this.drawTrail(particle)
    })
  }

  createRandomParticle (particleOpts) {
    let x = Math.random() * this.width
    let y = Math.random() * this.depth
    let z = this.height + Math.random() * this.height
    return new Particle(x, y, z, particleOpts)
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
    let za = particle.z
    let zb = particle.lastTrail.z

    for (let z = za; z < zb; z++) {
      let v = map(z, za, zb, 1, 0) ** 2
      let r = v * config.white[0]
      let g = v * config.white[1]
      let b = v * config.white[2]
      this.set(particle.x, particle.y, z, [r, g, b])
    }
  }

}
