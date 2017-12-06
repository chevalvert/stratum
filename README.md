# stratum [<img src="https://github.com/chevalvert.png?size=100" align="right">](http://chevalvert.fr/)

*Stratum main app*

<br>

```
stratum

Usage:
  stratum <ENV>
  stratum -klr --log-level=debug
  stratum 'lyon' -lts --log=<path>
  stratum 'dev' --with=<path>
  stratum --help
  stratum --version

Options:
  <ENV>                   Run with stratum.[config/mapping].ENV.json.
                          If left blank, run with 'dev' ENV.
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
[`stratum.config.<ENV>.json`](stratum.config.dev.json)

### Global config

|key|type|description|
|:---|:---|:---|
|`fps`|`int`|stratum main loop framerate|
|`ledsLength`|`int`|number of led on a strip|
|`white`|`[int R, int G, int B]`|color used as white|
|`timer`|
|`timer` `timeline`|`[string|int...]`|array of animations (either by name or by index) to play in sequence|
|`timer` `scrollIncrement`|`int`|number of led to scroll by frame|
|`timer` `minimumInterval`|`int ms`|delay between two scrolls|
|`leap`|
|`leap` `mockHandEasing`|`float`|easing value for the mock hand
|`sound`|
|`sound` `udp`|
|`sound` `udp` `local`|`string`|local IP for the UDP server. [This should be `0.0.0.0`](https://github.com/colinbdclark/osc.js/issues/83#issuecomment-290567155)
|`sound` `udp` `remote`|`string`|remote IP to connect to|
|`sound` `udp` `port`|`int`|remote port to connect to|
|`sound` `udp` `reconnection`|
|`sound` `udp` `reconnection` `delay`|`int ms`|delay between to reconnection attempts|
|`sound` `udp` `reconnection` `attempts`|`int`|number max of reconnection attempts|
|`sound` `playInterval`|`int ms`|delay between to `/play, 1` messages|
|`sound` `floatDecimals`|`int`|number of float decimals for `OSC float` messages|
|`sound` `mixer`|`[float min, float max]`|mixer masters from 0 to 1|

### Separator

|key|type|description|
|:---|:---|:---|
|`color`|`[int R, int G, int B]`|color of the separator|
|`height`|`int`|height of the separator|

### Cave

|key|type|description|
|:---|:---|:---|
|`color`|`[int R, int G, int B]`|color of the cave|
|`camera`|
|`camera` `speed`|`int`|moving speed of the camera. Negative value invert the direction|
|`camera` `noise`|
|`camera` `noise` `resolution`|`float`|resolution of the perlin noise used to simulate the cave|
|`camera` `noise` `zoff`|`[float min, float max]`|min and max noise z offset|
|`sound`|
|`sound` `name`|
|`sound` `name` `on`|`string`|name of the OSC message controling the noteOn|
|`sound` `name` `off`|`string`|name of the OSC message controling the noteOff|
|`sound` `volume`|`string`|name of the OSC message controling the sound volume|
|`sound` `thresholdZ`|`float`|normalized height of the noteChange trigger|
|`sound` `mod`|`[float min, float max]`|min and max sound volume|
|`sound` `easing`|`float`|value of the in/out volume easing|
|`sound` `notes`|`[int...]`|sequence of note played when triggering noteChange|

### Earth

|key|type|description|
|:---|:---|:---|
|`camera`|
|`camera` `speed`|`int`|moving speed of the camera. Negative value invert the direction|
|`camera` `noise`|
|`camera` `noise` `resolution`|`float`|resolution of the perlin noise used to simulate|
|`camera` `noise` `zoff`|`[float min, float max]`|min and max noise z offset|
|`sounds`|`[sound...]`
|`sounds` `[0]`|
|`sounds` `[0]` `name`|`string`|name of the event controling the Z sound|
|`sounds` `[0]` `mod`|`[float min, float max]`|min and max sound volume for this sound|
|`sounds` `[0]` `easing`|`float`|value of the in/out volume easing|
|`sounds` `[1]`|
|`sounds` `[1]` `name`|`string` name of the event controling the "fill" sound|
|`sounds` `[1]` `mod`|`[float min, float max]`|min and max value for this event|

### Rain

|key|type|description|
|:---|:---|:---|
|`color`|`[int R, int G, int B]`|color of the rain drops|
|`ripple`|
|`ripple` `enable`|`boolean`|enable or disable the ripple effect when a drop hit the floor|
|`ripple` `color`|`[int R, int G, int B]`|color of the ripples|
|`ripple` `triggerZ`|`[int min, int max]`|min and max value for the Z threshold of the ripple trigger|
|`particlesLength`|`[int min, int max]`|min and max length of rain drops|
|`particle`|
|`particle` `trailLength`|`[int min, int max]`|min and max length of the rain drops trail|
|`particle` `maxSpeed`|`[float min, float max]`|min and max speed of the rain drops|
|`particle` `acceleration`|`Vec3[float, float, float]`|3D vector controlling the main direction of the rain drops|
|`sound`|
|`sound` `name`|`string`|name of the event controling the sound effect triggered by a rain drop hitting the floor|
|`sound` `notes`|`[int...]`|pool of notes played randomly when a rain drop hits the floor|
|`sound` `velocity`|`[int min, int max]`|min and max value of the note velocity|
|`sound` `duration`|`[int ms min, int ms max]`|min and max value of the note duration|

### Storm

|key|type|description|
|:---|:---|:---|
|`colors`|`[[int R, int G, int B]...]`|pool of colors used for the strikes|
|`delay`|`[int s min, int s max]`|min and max delay between two strikes|
|`duration`|`[int s min, int s max]`|min and max duration of a strike|
|`maxStrikesLength`|`int`|maximum length of concurrent strikes|
|`sky`|
|`sky` `enable`|`boolean`|enable or disable the sky layer|
|`sky` `opacity`|`float`|control the amount of light|
|`sky` `resolution`|`float`|resolution of the perlin noise used to simulate the sky's clouds|
|`sky` `blinkDelay`|`[float s min, float s max]`|min and max delay between to sky blink|
|`sky` `blinkDuration`|`[float min, float max]`|min and max duration of a blink|
|`sky` `contrast`|`int`|exponent for the perlin contrast|
|`sky` `displayThreshold`|`float`|threshold above which the value is used|
|`sound`|
|`sound` `name`|`string`|name of the event triggered when a strike is alive|
|`sound` `note`|`int`|note played when the event is triggered|
|`sound` `velocity`|`int`|velocity of the note|

### Wind

|key|type|description|
|:---|:---|:---|
|`particlesLength`|`[int min, int max]`|min and max length of the wind particles|
|`amplitude`|`[int x, int y]`|x and y amplitude of the sine wave|
|`particle`|
|`particle` `trailLength`|`int`|min and max length of the wind particles trail|
|`particle` `maxSpeed`|`float`|max speed of the wind particles|
|`particle` `acceleration`|`Vec3[float, float, float]`|3D vector controlling the main direction of the wind particles|
|`sounds`|`[sound...]`
|`sounds` `[0]`|
|`sounds` `[0]` `name`|`string`|name of the sound controlled by the length of particles|
|`sounds` `[0]` `mod`|`[float min, float max]`|min and max value of the sound's volume|
|`sounds` `[1]`|
|`sounds` `[1]` `name`|`string`|name of the sound controlled by the height of the sine wave|
|`sounds` `[1]` `mod`|`[float min, float max]`|min and max value of the sound's volume|

<br>

## License
[MIT.](https://tldrlegal.com/license/mit-license)
