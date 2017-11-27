'use strict'

const path = require('path')
const { args, paths, config, log } = require(path.join(__dirname, '..', 'main.config.js'))

const hnode = require('hnode')
const Point = require(path.join(paths.utils, 'point'))

const server = new hnode.Server()

server.on('newnode', node => {
  node.lockRate(1000 / 40)

  if (log.level >= 7) {
    node.on('start', () => log.debug(`start ${node.ip}:${node.name}`))
    node.on('online', () => log.debug(`online ${node.ip}:${node.name}`))
    node.on('offline', () => log.debug(`offline ${node.ip}:${node.name}`))
    node.on('stop', () => log.debug(`stop ${node.ip}:${node.name}`))
  }
})


// @IMPORTANT: [x, y, z] corresponds to [width, depth, height] axes
const points = pointsFromMappedNodes(config.nodes)
const { width, depth } = computeSize(points)
const aera = width * depth * config.ledsLength

server.setRate(1000 / config.fps)

server.on('newnode', node => {
  node.on('online', () => {
    let points = getPointsByNodeName(node.name)
    points.forEach(point => point.register(node))
  })
})

let observers = []
let now = Date.now()
let last = now

server.on('tick', () => {
  now = Date.now()
  for (let i = 0; i < observers.length; i++) observers[i](now - last)
  last = now
})

module.exports = {
  get config () { return config },
  get server () { return server },

  get width () { return width },
  get depth () { return depth },
  get height () { return config.ledsLength },
  get aera () { return aera },

  get points () { return points },

  start: () => server.start(),
  resume: () => server.start(),

  pause: () => server.stop(),

  clear: () => server.blackout(),

  set: (x, y, z, rgb = [255, 0, 255]) => {
    if (x < 0 || x >= width) return
    if (y < 0 || y >= depth) return
    if (z < 0 || z >= config.ledsLength) return

    let point = getPoint(Math.floor(x), Math.floor(y))
    if (point) point.set(Math.floor(z), rgb)
  },

  raf: fn => {
    if (typeof fn === 'function' && !~observers.indexOf(fn)) {
      observers.push(fn)
    }
  },

  remove: fn => {
    let index = observers.indexOf(fn)
    if (index >= 0) observers.splice(index, 1)
  }
}

function pointsFromMappedNodes (nodes) {
  let points = []
  for (let nodeName in nodes) {
    nodes[nodeName].forEach(([x, y], index) => {
      if (!points[x]) points[x] = []
      points[x][y] = new Point({x, y, nodeName, index})
    })
  }
  return points
}

function computeSize (points) {
  let xmax = 0
  let ymax = 0

  for (let x = 0; x < points.length; x++) {
    if (x > xmax) xmax = x
    for (let y = 0; y < points[x].length; y++) {
      if (y > ymax) ymax = y
    }
  }

  // @NOTE: +1 because coordinates are zero-based, whereas dimensions aren't
  return {width: xmax + 1, depth: ymax + 1}
}

function getPointsByNodeName (parentNodeName) {
  return points.reduce((found, cols) => {
    return found.concat(cols.filter(point => point.nodeName === parentNodeName))
  }, [])
}

function getPoint (x, y) {
  return points[x] ? points[x][y] : null
}
