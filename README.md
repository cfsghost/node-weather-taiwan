# node-weather-taiwan
Node.js module to fetch weather data for Taiwan from Central Weather Bureau(http://opendata.cwb.gov.tw) in Taiwan.

[![NPM](https://nodei.co/npm/weather-taiwan.png)](https://nodei.co/npm/weather-taiwan/)

## Installation

Install via NPM:
```
npm install weather-taiwan
```

## Usage

First, you have to sign up on Central Weather Bureau(http://opendata.cwb.gov.tw) to be allowed to download open data, then get an API key for your application.

```js
var dtmdem = require('weather-taiwan');

var fetcher = weatherTW.fetch('<YOURACCESSKEY>');

var parser = weatherTW.parse();

parser.on('data', function(data) {
	console.log(data);
});

fetcher.pipe(parser);
```

License
-
Licensed under the MIT License

Authors
-
Copyright(c) 2016 Fred Chien <<cfsghost@gmail.com>>
