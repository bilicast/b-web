/*********************************************************************************************
 *
 * UTIL-CLASS
 *
 *********************************************************************************************
 *
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 * Inspired by base2 and Prototype
 *
 *********************************************************************************************
 *
 * @refer
 * http://ejohn.org/blog/simple-javascript-inheritance/
 * http://bluepoet.me/2012/07/22/%EB%B2%88%EC%97%AD%EA%B0%84%EB%8B%A8%ED%95%9C-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%83%81%EC%86%8D/
 *
 *********************************************************************************************/


(function(root, factory) {

	/*******************************************************************************************
	 *
	 * AMD
	 *
	 *******************************************************************************************/
	if (typeof(define) === 'function' && define.amd) {
		define(['require', 'exports', 'module'], factory);
	} else if (typeof(module) != 'undefined' && module) {
		module.exports = factory(require('require'), require('exports'), require('module'));
	} else {
		root.Class = factory(null, null, null);
	}

}(window || this, function() {
	var initializing = false, fnTest = /xyz/.test(function() {xyz;}) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	var Class = function() {};

	// Create a new Class that inherits from this class
	Class.extend = function(prop) {
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for (var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function" &&
			typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				(function(name, fn) {
					return function() {
						var tmp = this._super;

						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = _super[name];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				})(name, prop[name]) :
				prop[name];
		}

		// The dummy class constructor
		function Class () {
			// All construction is actually done in the init method
			if (!initializing && this.initialize) this.initialize.apply(this, arguments);
		};

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
	};

	return Class;
}));