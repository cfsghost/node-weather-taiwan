var Transform = require('stream').Transform;
var util = require('util');

var Parser = module.exports = function(options) {
	if (!(this instanceof Parser))
		return new Parser(options);

	var options = this.options = options || {
		highWaterMark: 16,
		outputString: false
	};

	Transform.call(this, {
		highWaterMark: options.highWaterMark || 16,
		objectMode: true
	});
}

util.inherits(Parser, Transform);

Parser.prototype._transform = function(data, encoding, callback) {

	var elements = {};
	data.children.weatherElement.forEach(function(element) {
		elements[element.children.elementName.value] = parseFloat(element.children.elementValue.children.value.value);
	})

	var parameters = {};
	data.children.parameter.forEach(function(parameter) {
		parameters[parameter.children.parameterName.value] = parameter.children.parameterValue.value;
	})

	var result = {
		lat: parseFloat(data.children.lat.value),
		lon: parseFloat(data.children.lon.value),
		locationName: data.children.locationName.value,
		stationId: data.children.stationId.value,
		obsTime: data.children.time.children.obsTime.value,
		elements: elements,
		parameters: parameters
	};

	if (this.options.outputString) {
		this.push(JSON.stringify(result));
	} else {
		this.push(result);
	}

	callback();
};
