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

    const len = (this.config.particlesLength[0] + this.config.particlesLength[1]) / 2
    for (let i = 0; i < len; i++) {
      const x = Math.random() * this.width
      const y = Math.random() * this.depth
      this.particles[i] = this.createParticle(this.config.particle)
    }
  }

  update (dt) {
    super.update(dt)
    this.clear()

    const h = hand([1, 1, 1]) || { x: 0.5, y: 0.5, z: 0.5 }
    const particlesLength = map(h.x, 0, 1, this.config.particlesLength[0], this.config.particlesLength[1])
    const maxSpeed = map(h.y, 0, 1, this.config.particle.maxSpeed[0], this.config.particle.maxSpeed[1])
    const trailLength = h ? map(h.z, 0, 1, this.config.particle.trailLength[0], this.config.particle.trailLength[1]) : 1

    const particleOpts = {
      ...this.config.particle,
      maxSpeed,
      trailLength: trailLength | 0
    }

    if (this.particles.length < particlesLength) {
      for (let i = 0; i < particlesLength - this.particles.length; i++) {
        this.particles.push(this.createParticle(particleOpts))
      }
    }

    this.particles.forEach((particle, index) => {
      particle.opts.maxSpeed = maxSpeed
      particle.opts.trailLength = trailLength
      particle.update()

      if (particle.oob && particle.z < 0) {
        if (Particle.isOob(particle.lastTrail)) {
          if (index < particlesLength) {
            this.particles[index] = this.createParticle(particleOpts)
          } else this.particles.splice(index, 1)
        }
        if (this.config.ripple.enable) {
          if (particle.z < this.config.ripple.triggerZ[0] && particle.z > this.config.ripple.triggerZ[1]) {
            this.drawRipple(particle)
          }
        }
      }

      this.drawTrail(particle, trailLength)
    })
  }

  createParticle (particleOpts) {
    const x = this.width * Math.random()
    const y = this.depth * Math.random()
    const z = this.height + Math.random() * this.height
    return new Particle(x, y, z, particleOpts)
  }

  drawRipple (particle) {
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        this.set(particle.x + x, particle.y + y, 0, this.config.ripple.color)
      }
    }
  }

  drawTrail (particle, len) {
    const za = particle.z
    const zb = particle.z + len

    for (let z = za; z < zb; z++) {
      const v = Math.max(0.01, map(z, za, zb, 1, 0) ** 2)
      const r = v * this.config.color[0]
      const g = v * this.config.color[1]
      const b = v * this.config.color[2]
      this.set(particle.x, particle.y, z, [r, g, b])
    }
  }

}
