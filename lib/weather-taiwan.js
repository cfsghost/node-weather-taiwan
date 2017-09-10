var hyperquest = require('hyperquest');
var saxStream = require('sax-stream');
var pipe = require('multipipe');
var Parser = require('./parser');
var RainfallParser = require('./rainfall_parser');
var Transform = require('stream').Transform;

var apiUrl = 'http://opendata.cwb.gov.tw/opendataapi?dataid=O-A0001-001&authorizationkey=';

module.exports = {
	fetch: function(key) {
		return hyperquest(apiUrl + key);
	},
	parse: function(opts) {
		return pipe(saxStream({
			strict: true,
			tag: 'location'
		}), new Parser(opts));

	},
	Rainfall: {
		fetch: function(key) {
			return hyperquest('http://opendata.cwb.gov.tw/opendataapi?dataid=O-A0002-001&authorizationkey=' + key);
		},
		parse: function(opts) {
			return pipe(saxStream({
				strict: true,
				tag: 'location'
			}), new RainfallParser(opts));

		}
	}
};
