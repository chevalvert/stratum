'use strict'

const path = require('path')
const { paths } = require(path.join(__dirname, '..', 'main.config.js'))
const { map } = require('missing-math')
const { hand } = require(path.join(paths.lib, 'leap'))
const sound = require(path.join(paths.lib, 'sound'))

const Particle = require(path.join(paths.utils, 'particle'))
const Animation = require(path.join(paths.utils, 'animation'))

module.exports = class Rain extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
    this.particles = []
    this.rippleNotesIndex = 0

    const len = (this.config.particlesLength[0] + this.config.particlesLength[1]) / 2
    for (let i = 0; i < len; i++) {
      this.particles[i] = this.createParticle(this.config.particle)
    }
  }

  update (dt) {
    super.update(dt)
    sound.enabled && this.manager.hasScrolled && sound.send('/mix', [3, this.percentVisible])

    this.clear()

    const h = hand()
    const particlesLength = map(h.x, 0, 1, this.config.particlesLength[0], this.config.particlesLength[1])
    const maxSpeed = map(h.y, 0, 1, this.config.particle.maxSpeed[0], this.config.particle.maxSpeed[1])
    const trailLength = map(h.z, 0, 1, this.config.particle.trailLength[0], this.config.particle.trailLength[1])

    const particleOpts = {
      ...this.config.particle,
      maxSpeed,
      trailLength: trailLength | 0
    }

    if (this.particles.length < particlesLength) {
      for (let i = 0; i < particlesLength - this.particles.length; i++) {
        this.particles.push(this.createParticle(particleOpts))
      }
    }

    this.particles.forEach((particle, index) => {
      particle.opts.maxSpeed = maxSpeed * map(Math.random(), 0, 1, this.config.speedVariationFactor[0], this.config.speedVariationFactor[1])
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
            if (sound.enabled && !particle.soundHasBeenTriggered) {
              const velocity = Math.floor(map(this.particles.length, this.config.particlesLength[0], this.config.particlesLength[1], this.config.sound.velocity[0], this.config.sound.velocity[1]))
              const duration = Math.floor(map(this.particles.length, this.config.particlesLength[0], this.config.particlesLength[1], this.config.sound.duration[0], this.config.sound.duration[1]))
              sound.send(this.config.sound.name, [particle.note, velocity, duration])
              particle.soundHasBeenTriggered = true
            }
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

    const particle = new Particle(x, y, z, particleOpts)
    this.rippleNotesIndex = ++this.rippleNotesIndex % this.config.sound.notes.length

    particle.soundHasBeenTriggered = false
    particle.note = this.config.sound.notes[this.rippleNotesIndex]
    return particle
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
