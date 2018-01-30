# stratum/configuration

For more insights, run `stratum-app` with the `-r, --reload` flag :
```sh
$ stratum "dev" --reload # enable live reloading of stratum.config.dev.json
```

<br>

### [`stratum.config.<ENV>.json`](../stratum.config.dev.json)

```
{
  "fps": 60,                          # stratum main loop framerate
  "ledsLength": 90,                   # number of led on a strip
  "white": [255, 200, 150],           # color used as white

  "timer": {
    "timeline": [                     # array of animations 
      "cave", "earth", "rain"         # can be as long as wanted
    ],
    "scrollIncrement": 1,             # scroll speed in LED/frame 
    "minimumInterval": 10000          # delay between to scroll in ms
  },

  "leap": { 
    "mockHandEasing": 0.09            # easing value of the leap mock hand
  },

  "sound": {
    "udp": {
      "local": "0.0.0.0",             # local IP for the UDP server. This should be "0.0.0.0"
      "remote": "127.0.0.1",          # remote IP to connect to
      "port": 2222,                   # remote port to connect to
      "reconnection": {
        "delay": 10000,               # delay between to reconnection attempts when connection lost
        "attempts" : 30               # number of max reconnection attempts
      }
    },
    "playInterval": 10000,            # delay between to `/play` messages
    "floatDecimals" : 3,              # number of float decimals for `OSC float` message
    "mixer": [0, 1]                   # tracks masters range (from 0 to 1)
  },

  "animations": {
    "separator": {             
      "color": [255, 0, 0],           # [R,G,B] color
      "height": 1                     # height in LED
    },

    "cave": {
      "color": [255, 200, 220],       # [R,G,B] color
      "camera": { 
        "speed": -0.003               # speed of the camera (negative value invert the cam direction)
      },  
      "noise": {
        "resolution": 0.2,            # resolution of the perlin noise used to simulate the cave
        "zoff": [1, -0.25]            # min and max noise z offset
      },
      "sound": {
        "name": {
          "on": "/cave-on",           # name of the OSC message controlling the noteOn event
          "off": "/cave-off",         # name of the OSC message controlling the noteOff event
          "volume": "/cave-1"         # name of the OSC message controlling the sfx volume
        },
        "thresholdZ": 0.3,            # normalized height of the noteChange leapmotion trigger
        "mod": [0, 0.5],              # volume range (from 0 to 1)
        "easing": 0.09,               # easing value of the in/out volume
        "notes": [53, 57, 60]         # sequence of midi notes played when noteChange fires
      }
    },

    "earth": {
      "camera": { 
        "speed": -0.008               # speed of the camera (negative value invert the cam direction)
      },
      "noise": {
        "resolution": 0.1,            # resolution of the perlin noise used to simulate the terrain
        "zoff": [-0.25, 0.5]          # min and max noise z offset
      },
      "sounds": [
        {
          "name": "/earth-1",         # name of the OSC message controlling the Z sfx
          "mod": [0, 0.5],            # volume range (from 0 to 1) of the Z sfx
          "easing": 0.09              # easing value of the in/out volume
        },
        {
          "name": "/earth-2",         # name of the OSC message controlling the fill sfx
          "mod": [0.8, 0.8]           # volume range (fomr 0 to 1) of the Z sfx
        }
      ]
    },

    "rain": {
      "color": [255, 200, 220],       # [R,G,B] color of the rain drops
      "ripple": {
        "enable": true,               # enable the ripple effect when a drop hits the floor
        "color": [12, 10, 7],         # [R,G,B] color of the ripples
        "triggerZ": [-2, -10]         # height range of the ripple event trigger
      },
      "speedVariationFactor" : [0.5, 1.5], # range of the random speed offset of a specific rain drop
      "particlesLength": [3, 80],     # range of the rain drops length
      "particle": {
        "trailLength": [1, 50],       # trail length range of the rain drops
        "maxSpeed": [0.1, 2],         # speed range of the rain drops
        "acceleration": [0, 0, -0.01] # vec3 controlling the direction of the rain drops
      },
      "sound": {
        "name": "/rain",              # name of the OSC message controlling the rain sfx
        "notes": [65, 76, 72, 59],    # array of midi notes randomly played for the rain sfx
        "velocity": [1, 127],         # velocity range of the rain sfx midi notes
        "duration": [10, 100]         # duration range of the rain sfx midi notes
      }
    },

    "storm": {
      "colors": [                     # array of [R,G,B] strikes colors
        [255, 200, 220],
        [255, 255, 255],
        [255, 200, 150]
      ],
      "delay": [0.1, 2],              # delay range between two strikes
      "duration": [0.1, 0.5],         # duration range of a specific strike
      "maxStrikesLength": 2,          # number of concurrent strikes
      "sky": {
        "enable": true,               # enable the sky layer
        "opacity": 1,                 # control the opacity of the sky layer
        "resolution": 0.1,            # resolution of the perlin noise used to simulate the sky
        "blinkDelay": [0, 5],         # delay range in seconds between to sky blink
        "blinkDuration": [0.1, 0.3],  # duration range in seconds of a blink
        "contrast": 3,                # exponent for the perlin contrast eq
        "displayThreshold": 2.58      # threshold above which the sky is allowed to control a specific LED
      },
      "sound": {
        "name": "/storm",             # name of the OSC message controlling the strike sfx
        "note": 65,                   # midi note played by the strike sfx
        "velocity": 127               # velocity of the strike sfx midi note
      }
    },

    "wind": {
      "particlesLength": [3, 100],    # range of wind particles length
      "amplitude": [10, 10],          # [x,y] amp coef of the sine waves
      "particle": { 
        "trailLength": 3,             # trail length range of the wind particles
        "maxSpeed": 0.1,              # max speed of the wind particles
        "acceleration": [0.01, 0, 0]  # vec3 controlling the direction of the wind particles
      },
      "sounds": [
        {
          "name": "/wind-1",          # name of the OSC message controlling the particles length sfx
          "mod": [0, 0.01]            # sfx volume range
        },
        {
          "name": "/wind-2",          # name of the OSC message controlling the particles height sfx 
          "mod": [0, 0.1]             # sfx volume range
        }
      ]
    }
  }
}
```

<sup>Note: `config.sound.udp.local` [should always be `0.0.0.0`](https://github.com/colinbdclark/osc.js/issues/83#issuecomment-290567155).</sup>
