# stratum [<img src="https://github.com/chevalvert.png?size=100" align="right">](http://chevalvert.fr/)
**[Stratum](https://github.com/chevalvert?q=stratum)** main app

<br>

## [Stratum](https://github.com/chevalvert?q=stratum) ecosystem
- `stratum` : Stratum main app
- [`stratum-assistant`](https://github.com/chevalvert/stratum-assistant) : Stratum setup and mapping assistant
- [`stratum-hnode`](https://github.com/Hemisphere-Project/STRATUM) : leds UDP server + client
- [`stratum-viewer`](https://github.com/chevalvert/stratum-viewer) : Stratum `hnode` 3D previewer
- [`stratum-documentation`](https://github.com/chevalvert/stratum-documentation) : Stratum hardware, hookup & misc guides

## Installation
```sh
$ git clone https://github.com/chevalvert/stratum.git stratum-app
$ cd stratum-app
$ npm install
$ npm link
```

## Usage
```
stratum

Usage:
  stratum <ENV>
  stratum -klr --log-level=debug
  stratum 'production' -lts --log=<path>
  stratum 'dev' --with=<path>
  stratum --help
  stratum --version

Options:
  <ENV>                   Run with stratum.[config|mapping].ENV.json.
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

## Connection
To connect to `stratum` via UDP, use the following IPV4 config:
```
IP Address: 192.168.0.200
Subnet Mask: 255.255.255.0
Router: 192.168.0.1
```

## Configuration 
See [docs/configuration.md](docs/configuration.md)

## License
[MIT.](https://tldrlegal.com/license/mit-license)
