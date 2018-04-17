'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const { height } = require(path.join(paths.lib, 'stratum'))

const Separator = require(path.join(paths.animations, 'separator'))

function stack (animations) {
  let offset = 0
  let targetOffset = 0
  let stackHeight = 0
  let index = 0
  let running = false
  let hasScrolled = false

  const api = {
    set offset (o) { targetOffset = o },
    get offset () { return offset },

    next: () => {
      if (index < animations.length - 1) {
        let animation = animations[++index]
        if (animation.name === Separator.name) api.next()
        else scrollTo(animation)
      }
    },

    previous: () => {
      if (index > 0) {
        let animation = animations[--index]
        if (animation.name === Separator.name) api.previous()
        else scrollTo(animation)
      }
    },

    select: selector => {
      if (typeof selector === 'string') {
        let { index } = getAnimationByName(selector)
        return api.select(index)
      }

      if (selector >= 0 && selector < animations.length) {
        index = selector
        scrollTo(animations[index])
      }
    },

    get running () { return running },
    resume: () => { running = true },
    pause: () => { running = false },

    get visibleAnimations () { return animations.filter(a => a.isVisible()) },
    get hasScrolled () { return hasScrolled },

    update: dt => {
      if (running) {
        updateScroll()
        animations.forEach(animation => {
          animation.isVisible && animation.update(dt)
        })
      }
    }
  }

  animations = animations.map((Animation, i) => {
    Animation = (typeof Animation === 'string')
      ? require(path.join(paths.animations, Animation))
      : Animation

    let animation = new Animation(api, stackHeight)
    stackHeight += animation.config.height || height
    return animation
  })

  return api

  function updateScroll () {
    hasScrolled = false
    if (targetOffset !== offset) {
      offset += config.timer.scrollIncrement * Math.sign(targetOffset - offset)
      hasScrolled = true
    }
  }

  function scrollTo (animation) {
    if (animation) targetOffset = animation.offset
  }

  function getAnimationByName (name) {
    let index = animations.findIndex(a => a.name.toLowerCase() === name.toLowerCase())
    return {
      index,
      animation: animations[index]
    }
  }
}

module.exports = { stack, Separator }
