"use strict"

var util = require('util')
var EventEmitter = require('events').EventEmitter

function DMX(options) {
	var options = options || {}
	this.universes = {}
	this.drivers   = {}
	this.devices   = options.devices || require('./devices')

	this.registerDriver('null',                   require('./drivers/null'))
	this.registerDriver('artnet',                 require('./drivers/artnet'))
}

util.inherits(DMX, EventEmitter)

DMX.devices   = require('./devices')
DMX.Animation = require('./anim')

DMX.prototype.registerDriver = function(name, module) {
	this.drivers[name] = module
}

DMX.prototype.addUniverse = function(name, driver, device_id, options) {
	return this.universes[name] = new this.drivers[driver](device_id, options)
}

DMX.prototype.update = function(universe, channels) {
	this.universes[universe].update(channels)
	this.emit('update', universe, channels)
}

DMX.prototype.updateAll = function(universe, value) {
	this.universes[universe].updateAll(value)
	this.emit('updateAll', universe, value)
}

DMX.prototype.universeToObject = function(universe) {
	var universe = this.universes[universe]
	var u = {}
	for(var i = 0; i < 512; i++) {
		u[i] = universe.get(i)
	}
	return u
}

module.exports = DMX
