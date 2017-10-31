'use strict'

const leapjs = require('leapjs')
const controller = new leapjs.Controller()

controller.on('connect', () => console.log('Successfully connected.'))
controller.on('streamingStarted', () => console.log('A Leap device has been connected.'))
controller.on('streamingStopped', () => console.log('A Leap device has been disconnected.'))

controller.connect()

function getEnsuredHandProperty (key, frame) {
  frame = frame || controller.frame(0)
  if (frame.hands[0]) return frame.hands[0][key]
}

module.exports = {
  timeVisible: () => getEnsuredHandProperty('timeVisible'),
  hand: (box) => {
    /**
     * NOTE:
     * the leap Y component is vertical
     * the leap Z component is horizontal
     * SEE: https://developer.leapmotion.com/documentation/csharp/devguide/Leap_Coordinate_Mapping.html
     */

    if (!box) {
      let position = getEnsuredHandProperty('stabilizedPalmPosition')
      if (position) {
        return {
          x: position[0],
          y: position[2],
          z: position[1]
        }
      } else return null
    }

    let frame = controller.frame(0)
    let interactionBox = frame.interactionBox
    let handPosition = getEnsuredHandProperty('stabilizedPalmPosition', frame)
    if (interactionBox && handPosition) {
      let npos = interactionBox.normalizePoint(handPosition, true)
      return {
        x: npos[0] * box[0],
        y: npos[2] * box[1],
        z: npos[1] * box[2]
      }
    }
  }
}
