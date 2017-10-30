'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const stratum = require(path.join(paths.lib, 'stratum'))

module.exports = function (animations) {
  let offset = 0
  let targetOffset = 0
  let running = false

  const api = {
    get offset () { return offset },
    set offset (o) {
      offset = Math.max(0, Math.min(o, animations.length * stratum.height))
    },

    get targetOffset () { return targetOffset },
    set targetOffset (o) {
      targetOffset = Math.max(0, Math.min(o, animations.length * stratum.height))
    },

    next: () => { api.targetOffset += stratum.height },
    previous: () => { api.targetOffset -= stratum.height },

    select: name => {
      let animation = getAnimationByName(name)
      if (animation) api.targetOffset = animation.offset
    },

    get running () { return running },
    resume: () => { running = true },
    pause: () => { running = false },

    get visibleAnimations () { return animation.filter(a => a.isVisible() )},

    update: dt => {
      if (running) {

        if (targetOffset !== offset) {
          offset += config.scrollIncrement * Math.sign(targetOffset - offset)
        }

        animations.forEach(animation => {
          if (animation.isVisible()) {
            animation.update(dt)
            animation.drawFloor()
          }
        })
      }
    }
  }

  animations = animations.map((Animation, i) => new Animation(api, i * stratum.height))

  return api

  function getAnimationByName (name) {
    return animation.filter(a => a.name === name)
  }
}
