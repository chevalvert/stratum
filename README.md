# stratum [<img src="https://github.com/chevalvert.png?size=100" align="right">](http://chevalvert.fr/)

*Stratum main app*

<br>

```
stratum

Usage:
  stratum
  stratum -klr --log-level=debug
  stratum -lts --log=<path>
  stratum --with=<path>
  stratum --help
  stratum --version

Options:
  -h, --help              Show this screen.
  -k, --keys              Enable prev/next animations using arrow keys.
  -l, --leap              Enable leapmotion.
  -r, --reload            Enable livereloading of stratum.config.json.
  -t, --timer             Enable prev/next stack timer.
  -s, --sound             Enable OSC sound output.
  -v, --version           Print the current version.
  -w, --with=<path>       Open the stratum-viewer applet as its visualiser.
  
  --log=<path>            Pipe stdout to the specified log file.
  --log-level=<level>     Set the log level (default is 'info').
  
Log level:
  0, emergency            System is unusable.
  1, alert                Action must be taken immediately.
  2, critical             The system is in critical condition.
  3, error                Error condition.
  4, warning              Warning condition.
  5, notice               A normal but significant condition.
  6, info                 A purely informational message.
  7, debug                Messages to debug an application.
```

<br>

## Stratum ecosystem
- `stratum` : stratum main app
- [`stratum-assistant`](https://github.com/chevalvert/stratum-assistant) : stratum setup and mapping assistant
- [`stratum-hnode`](https://github.com/Hemisphere-Project/STRATUM) : leds UDP server + client
- [`stratum-viewer`](https://github.com/chevalvert/stratum-viewer) : alternative UDP client

<br>

## Configuration 
[`stratum.config.json`](stratum.config.json)

### Global config
- **`fps`** `int` : stratum main loop framerate
- **`ledsLength`** `int` : number of led on a strip
- **`white`** `[int R, int G, int B]` : color used as white
- **`timer`** 
  - **`scrollIncrement`** `int` : number of led to scroll by frame
  - **`minimumInterval`** `int ms` : delay between two scrolls
- **`leap`** 
  - **`mockHandEasing`** `float` : easing value for the mock hand
- **`sound`** 
  - **`udp`** 
    - **`local`** `string` : local IP for the UDP server. [This should be `0.0.0.0`](https://github.com/colinbdclark/osc.js/issues/83#issuecomment-290567155).
    - **`remote`** `string` : remote IP to connect to.
    - **`port`** `int` : remote port to connect to.
    - **`reconnection`**
      - **`delay`** `int ms` : delay between to reconnection attempts.
      - **`attempts`** `int` : number max of reconnection attempts.
  - **`playInterval`** `int ms` : delay between to `/play, 1` messages.
  - **`floatDecimals`** `int` : number of float decimals for `OSC float` messages.
  - **`mixer`** `[float min, float max]` : mixer masters from 0 to 1

### Separator
- **`color`** `[int R, int G, int B]` : color of the separator
- **`height`** `int` : height of the separator

### Cave
- **`color`** `[int R, int G, int B]` : color of the cave
- **`camera`** 
  - **`speed`** `int` : moving speed of the camera. Negative value invert the direction.
- **`noise`** 
  - **`resolution`** `float` : resolution of the perlin noise used to simulate the cave.
  - **`zoff`** `[float min, float max]` : min and max noise z offset.
- **`sound`** 
  - **`name`**
    - **`on`** `string` : name of the OSC message controling the noteOn.
    - **`off`** `string` : name of the OSC message controling the noteOff.
    - **`volume`** `string` : name of the OSC message controling the sound volume.
  - **`thresholdZ`** `float` : normalized height of the noteChange trigger.
  - **`mod`** `[float min, float max]` : min and max sound volume.
  - **`easing`** `float` : value of the in/out volume easing.
  - **`notes`** `[int...]` : sequence of note played when triggering noteChange.

### Earth
- **`camera`** 
  - **`speed`** `int` : moving speed of the camera. Negative value invert the 
- **`noise`** 
  - **`resolution`** `float` : resolution of the perlin noise used to simulate 
  - **`zoff`** `[float min, float max]` : min and max noise z offset.
- **`sounds`** `[sound...]`
  - **`0`**
    - **`name`** `string` : name of the event controling the Z sound
    - **`mod`** `[float min, float max]` : min and max sound volume for this sound.
    - **`easing`** `float` : value of the in/out volume easing.
  - **`1`**
    - **`name`** `string` name of the event controling the "fill" sound.
    - **`mod`** `[float min, float max]` : min and max value for this event.

### Rain
- **`color`** `[int R, int G, int B]` : color of the rain drops.
- **`ripple`** 
  - **`enable`** `boolean` : enable or disable the ripple effect when a drop hit the floor.
  - **`color`** `[int R, int G, int B]` : color of the ripples.
  - **`triggerZ`** `[int min, int max]` : min and max value for the Z threshold of the ripple trigger.
- **`particlesLength`** `[int min, int max]` : min and max length of rain drops.
- **`particle`**
  - **`trailLength`** `[int min, int max]` : min and max length of the rain drops trail.
  - **`maxSpeed`** `[float min, float max]` : min and max speed of the rain drops.
  - **`acceleration`** `Vec3[float, float, float]` : 3D vector controlling the main direction of the rain drops.
- **`sound`**
  - **`name`** `string` : name of the event controling the sound effect triggered by a rain drop hitting the floor.
  - **`notes`** `[int...]` : pool of notes played randomly when a rain drop hits the floor.
  - **`velocity`** `[int min, int max]` : min and max value of the note velocity.
  - **`duration`** `[int ms min, int ms max]` : min and max value of the note duration.

### Storm
- **`colors`** `[[int R, int G, int B]...]` : pool of colors used for the strikes.
- **`delay`** `[int s min, int s max]` : min and max delay between two strikes.
- **`duration`** `[int s min, int s max]` : min and max duration of a strike.
- **`maxStrikesLength`** `int` : maximum length of concurrent strikes.
- **`sky`**
  - **`enable`** `boolean` : enable or disable the sky layer.
  - **`opacity`** `float` : control the amount of light
  - **`resolution`** `float` : resolution of the perlin noise used to simulate the sky's clouds.
  - **`blinkDelay`** `[float s min, float s max]` : min and max delay between to sky blink.
  - **`blinkDuration`** `[float min, float max]` : min and max duration of a blink.
- **`sound`**
  - **`name`** `string` : name of the event triggered when a strike is alive.
  - **`note`** `int` : note played when the event is triggered.
  - **`velocity`** `int` : velocity of the note.

### Wind
- **`particlesLength`** `[int min, int max]` : min and max length of the wind particles.
- **`amplitude`** `[int x, int y]` : x and y amplitude of the sine wave.
- **`particle`**
  - **`trailLength`** `int` : min and max length of the wind particles trail.
  - **`maxSpeed`** `float` : max speed of the wind particles.
  - **`acceleration`** `Vec3[float, float, float]` :3D vector controlling the main direction of the wind particles.
- **`sounds`** `[sound...]`
  - **`0`**
    - **`name`** `string` : name of the sound controlled by the length of particles.
    - **`mod`** `[float min, float max]` : min and max value of the sound's volume.
  - **`1`**
    - **`name`** `string` : name of the sound controlled by the height of the sine wave.
    - **`mod`** `[float min, float max]` : min and max value of the sound's volume.

<br>

## License
[MIT.](https://tldrlegal.com/license/mit-license)
