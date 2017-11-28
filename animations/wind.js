'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const { map } = require('missing-math')
const { hand } = require(path.join(paths.lib, 'leap'))
const sound = require(path.join(paths.lib, 'sound'))

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
    sound.enabled && this.manager.hasScrolled && sound.send('/mix', [5, this.percentVisible])

    this.clear()

    const h = hand()
    const surfaceHeight = h.z * this.height
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
    sound.enabled && this.sfx(surfaceHeight)
  }

  createParticle (particleOpts) {
    const x = -Math.random() * 2
    const y = this.depth * Math.random()
    const z = Math.random() * this.height
    return new Particle(x, y, z, particleOpts)
  }

  drawTrail (particle, len, surface) {
    const xa = particle.x
    const xb = particle.x + len

    const i = Math.round(particle.x)
    const j = Math.round(particle.y)
    if (surface[i] && particle.z < surface[i][j]) {
      for (let x = xa; x < xb; x++) {
        const v = Math.max(0.01, map(x, xa, xb, 1, 0) ** 2)
        const r = v * config.white[0]
        const g = v * config.white[1]
        const b = v * config.white[2]
        this.set(x, particle.y, particle.z, [r, g, b])
      }
    }
  }

  sfx (surfaceHeight) {
    sound.send(this.config.sounds[0].name,
               map(this.particles.length,
                   this.config.particlesLength[0],
                   this.config.particlesLength[1],
                   this.config.sounds[0].mod[0],
                   this.config.sounds[0].mod[1]))

    sound.send(this.config.sounds[1].name,
               map(surfaceHeight,
                   0,
                   this.height,
                   this.config.sounds[1].mod[0],
                   this.config.sounds[1].mod[1]))
  }
}
