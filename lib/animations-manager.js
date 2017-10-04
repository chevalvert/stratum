'use strict'

module.exports = function (animations) {
  let index = 0

  const api = {
    set index (i) {
      console.log(animations[i].name)
      index = i
    },

    next: () => {
      api.index = ++index % animations.length
    },

    previous: () => {
      api.index = index > 0 ? index - 1 : animations.length - 1
    },

    select: name => {
      for (let i = 0; i < animations.length; i++) {
        if (animations[i].name.toUpperCase() === name.toUpperCase()) {
          api.index = i
          break
        }
      }
    },

    update: dt => {
      animations[index].update(dt)
    }
  }

  animations = animations.map(Animation => new Animation(api))

  return api
}
