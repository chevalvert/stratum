'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const { Vec3 } = require('vec23')
const { map } = require('missing-math')
const { hand }  = require(path.join(paths.lib, 'leap'))

const Particle = require(path.join(paths.utils, 'particle'))
const Animation = require(path.join(paths.utils, 'animation'))

module.exports = class Wind extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
    this.particles = []

    for (let i = 0; i < this.config.particlesLength; i++) {
      this.particles[i] = this.createParticle(this.config.particle)
    }
  }

  update (dt) {
    super.update(dt)
    this.clear()

    const h = hand([1, 1, 1]) || { x: 0.5, y: 0.5, z: 0.5 }
    const surfaceHeight = this.height * h.z
    const particlesLength = map(h.x, 0, 1, this.config.particlesLength[0], this.config.particlesLength[1])

    let surface = []
    for (let x = 0; x < this.width; x++) {
      surface[x] = []
      for (let y = 0; y < this.depth; y++) {
        surface[x][y] = surfaceHeight + Math.cos(this.count * 1 + x / 10) * Math.sin(this.count * 0.3 + y / 10) * this.height / 4
      }
    }

    if (this.particles.length < particlesLength) {
      for (let i = 0; i < particlesLength - this.particles.length; i++) {
        this.particles.push(this.createParticle(this.config.particle))
      }
    }

    this.particles.forEach((particle, index) => {
      particle.update()

      if (particle.oob) {
        if (index < particlesLength) {
          this.particles[index] = this.createParticle(this.config.particle)
        } else this.particles.splice(index, 1)
      }

      this.drawTrail(particle, this.config.particle.trailLength, surface)
    })

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.depth; y++) {
        this.set(x, y, surface[x][y], config.white)
      }
    }
  }

  createParticle (particleOpts) {
    const x = - Math.random() * 2
    const y = this.depth * Math.random()
    const z = Math.random() * this.height
    return new Particle(x, y, z, particleOpts)
  }

  drawTrail (particle, len, surface) {
    const xa = particle.x
    const xb = particle.x + len

    if (surface[Math.round(particle.x)] && particle.z < surface[Math.round(particle.x)][Math.round(particle.y)]) {
      for (let x = xa; x < xb; x++) {
        const v = Math.max(0.01, map(x, xa, xb, 1, 0) ** 2)
        const r = v * config.white[0]
        const g = v * config.white[1]
        const b = v * config.white[2]
        this.set(x, particle.y, particle.z, [r, g, b])
      }
    }
  }

}
