# node-weather-taiwan
Node.js module to fetch weather data for Taiwan from Central Weather Bureau(http://opendata.cwb.gov.tw) in Taiwan.

這個 Node.js 模組讓你可以從最棒棒的中央氣象局取得全台灣天氣資料。

[![NPM](https://nodei.co/npm/weather-taiwan.png)](https://nodei.co/npm/weather-taiwan/)

## Installation

Install via NPM:
```
npm install weather-taiwan
```

## Usage

First, you have to sign up on Central Weather Bureau(http://opendata.cwb.gov.tw) to be allowed to download open data, then get an API key for your application.

記得，首先你必須去中央氣象局的開放資料網站（http://opendata.cwb.gov.tw ）先註冊一組登入帳號，然後使用這組帳號取得 API 金鑰，接著使用這把金鑰來取得天氣資料。

```js
var weatherTW = require('weather-taiwan');

// Fetching raw data from Central Weather Bureau
var fetcher = weatherTW.fetch('<YOURACCESSKEY>');

// Creating a parser to convert raw data to JavaScript object
var parser = weatherTW.parse();

parser.on('data', function(data) {
    console.log(data);
});

fetcher.pipe(parser);
```

### Support Stream and Pipe

Here is an example to use stream/pipe to convert data and output string to a file.

```js
var fs = require('fs');
var weatherTW = require('weather-taiwan');

weatherTW
    .fetch('<YOURACCESSKEY>')
    .pipe(weatherTW.parse({ outputString: true }))
    .pipe(fs.createWriteStream('current-weather.output'));
```

License
-
Licensed under the MIT License

Authors
-
Copyright(c) 2016 Fred Chien <<cfsghost@gmail.com>>
