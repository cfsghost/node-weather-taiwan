var Duplex = require('stream').Duplex;
var util = require('util');
var sax = require('sax');

var Parser = module.exports = function(options) {
	if (!(this instanceof Parser))
		return new Parser(options);

	var _options = Object.assign({
		objectMode: true
	}, options);

	Duplex.call(this, _options);

	this._options = _options;
	this._xmlParser = sax.parser(true);
	this._data = [];
	this.pending = false;
	this.isCompleted = false;

	var ignore = true;
	var newData;
	var content;

	// Elements
	var elements;
	var isElement = false;
	var isElementName = false;
	var isElementValue = false;
	var element = {
		name: null,
		value: null
	};

	// Parameters
	var parameters;
	var isParameter = false;
	var isParameterName = false;
	var isParameterValue = false;
	var parameter = {
		name: null,
		value: null
	};

	this._xmlParser.onopentag = function(node) {

		// Element
		if (isElement) {
			if (node.name == 'elementName') {
				isElementName = true;
				return;
			} else if (node.name == 'value') {
				isElementValue = true;
				return;
			} else if (node.name == 'elementValue') {
				ignore = true;
				return;
			}
		}

		// Parameter
		if (isParameter) {
			if (node.name == 'parameterName') {
				isParameterName = true;
				return;
			} else if (node.name == 'parameterValue') {
				isParameterValue = true;
				return;
			}
		}

		switch(node.name) {
		case 'location':
			ignore = false;
			newData = {};
			break;
		case 'weatherElement':
			isElement = true;

			if (newData['elements']) {
				elements = newData['elements'];
			} else {
				newData['elements'] = elements = {};
			}

			break;

		case 'parameter':
			isParameter = true;

			if (newData['parameters']) {
				parameters = newData['parameters'];
			} else {
				newData['parameters'] = parameters = {};
			}

			break;

		case 'time':
			break;
		}
	};

	this._xmlParser.onclosetag = function(nodeName) {

		// Element
		if (isElement) {
			if (nodeName == 'elementName') {
				isElementName = false;
				return;
			} else if (nodeName == 'value') {
				isElementValue = false;
				return;
			} else if (nodeName == 'elementValue') {
				ignore = false;
				return;
			}
		}

		// Parameter
		if (isParameter) {
			if (nodeName == 'parameterName') {
				isParameterName = false;
				return;
			} else if (nodeName == 'parameterValue') {
				isParameterValue = false;
				return;
			}
		}

		switch(nodeName) {
		case 'cwbopendata':
			this._xmlParser.close();
			return;

		case 'location':
			ignore = true;
			this._data.push(newData);
			return;

		case 'weatherElement':
			isElement = false;
			elements[element.name] = element.value;
			element.name = null;
			element.value = null;
			elements = null;
			return;

		case 'parameter':
			isParameter  = false;
			parameters[parameter.name] = parameter.value;
			parameter.name = null;
			parameter.value = null;
			parameters = null;
			return;

		case 'time':
			return;

		default:
			if (ignore)
				return;
		}

		switch(nodeName) {
		case 'lat':
		case 'lon':
			newData[nodeName] = parseFloat(content);
			break;

		default:
			newData[nodeName] = content;
		}

	}.bind(this);

	this._xmlParser.ontext = function(value) {

		// Element
		if (isElement) {
			if (isElementName) {
				element.name = value;
			} else if (isElementValue) {
				element.value = parseFloat(value);
			}

			return;
		}

		// Parameter
		if (isParameter) {
			if (isParameterName) {
				parameter.name = value;
			} else if (isParameterValue) {
				parameter.value = value;
			}

			return;
		}

		content = value;
	};

	this._xmlParser.onend = function() {
		this.isCompleted = true;

		if (!this._data.length)
			this.push(null);
	}.bind(this);
}

util.inherits(Parser, Duplex);

Parser.prototype._write = function(chuck, encoding, callback) {

	this._xmlParser.write(chuck, encoding);

	// Listener is waiting
	if (this.pending) {
		this.pending = false;
		this._read();
	}

	callback();
};

Parser.prototype._read = function() {

	if (this._data.length) {
		var data = this._data.shift();

		if (this._options.objectMode) {
			this.push(data);
		} else {
			this.push(JSON.stringify(data));
		}

	} else if (this.isCompleted) {
		this.push(null);
	} else {
		this.pending = true;
	}
};
