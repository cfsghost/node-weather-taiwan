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

	var result = {
		lat: parseFloat(data.children.lat.value),
		lon: parseFloat(data.children.lon.value),
		locationName: data.children.locationName.value,
		stationId: data.children.stationId.value,
		obsTime: data.children.time.children.obsTime.value
	};

	result = data.children.weatherElement
		.map(function(element) {
			return [
				element.children.elementName.value,
				parseFloat(element.children.elementValue.children.value.value)
			];
		})
		.reduce(function(result, entry) {
			result[entry[0]] = entry[1];
			return result;
		}, result);

	result = data.children.parameter
		.map(function(parameter) {

			return [
				parameter.children.parameterName.value,
				parameter.children.parameterValue.value
			];
		})
		.reduce(function(result, entry) {
			result[entry[0]] = entry[1];
			return result;
		}, result);

	if (this.options.outputString) {
		this.push(JSON.stringify(result));
	} else {
		this.push(result);
	}
	callback();
};
