'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const { Vec3 } = require('vec23')
const { map, perlin } = require('missing-math')

const stratum = require(path.join(paths.lib, 'stratum'))
const Animation = require(path.join(paths.utils, 'animation'))

module.exports = class Earth extends Animation {
  constructor (manager) {
    super(manager)
  }

  update (dt) {
    super.update(dt)
    stratum.clear()

    let xoff = this.count
    for (let x = 0; x < stratum.width; x++) {
      xoff += 0.1
      let yoff = 0
      for (let y = 0; y < stratum.depth; y++) {
        yoff += 0.1

        let z = perlin(xoff, yoff)
        // let zf = z < 0 ? 0 : map(z, 0, 1, 0, stratum.height)
        let zf = map(z, -1, 1, 0, stratum.height)

        // stratum.set(x, y, zf, [config.white[0], config.white[1], config.white[2]])

        for (let zoff = 0; zoff < zf; zoff++) {
          let v = map(zoff, 0, zf, 0, 1)
          let r = v * config.white[0]
          let g = v * config.white[1]
          let b = v * config.white[2]
          stratum.set(x, y, zoff, [r, g, b])
        }
      }
    }
  }
}
