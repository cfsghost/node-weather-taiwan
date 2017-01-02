var hyperquest = require('hyperquest');
var Parser = require('./parser');

var apiUrl = 'http://opendata.cwb.gov.tw/opendataapi?dataid=O-A0001-001&authorizationkey=';

module.exports = {
	fetch: function(key) {
		return hyperquest(apiUrl + key);
	},
	parse: function(opts) {
		return new Parser(opts);
	}
};
