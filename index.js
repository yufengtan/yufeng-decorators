const express = require('express');
const app = express();
const GetMapping = (path) => {
	return (target, name, descriptor) => {
		const oldValue = descriptor.value;
		descriptor.value = function() {
			console.log(`GetMapping ${path}`)
			return app.get(path, (req, res, next) => {
				let result = oldValue.bind(this)(req, res, next);
				if (result) {
					if (typeof result === 'object') {
						res.json(result);
					} else {
						res.send(result)
					}
				} else {
					next();
				}
			});
		}
		descriptor.enumerable = true;
		return descriptor;
	}
}

const RestController = (target) => {
	var cc = new target;
	for (let key in target.prototype) {
		cc[key]();
	}
}

const requireDir = require('./lib/requireDir');

module.exports = {
	app,
	GetMapping,
	RestController,
	requireDir
};