/**
 * ========================================================================
 * Javie version 1.0.0
 * ========================================================================
 *
 * @package     Javie
 * @require     underscore, console, jQuery/Zepto
 * @version     1.0.0       
 * @author      Mior Muhammad Zaki <http://git.io/crynobone>
 * @license     MIT License
 */

(function () { 'use strict';
	var root, Javie, _;
	
	root = this;

	// load all dependencies
	_ = root._;

	// Require underscore.js, if we're on the server, and it's not already present.
	if (!_ && ('undefined' !== typeof require)) {
		_ = require('underscore');
	}

	// throw an error if underscore.js still not available
	if (!_) {
		throw new Error('Expected Underscore.js not available');
	}

	/**
	 * Execute a set of command within specific environment, or all.
	 * 	
	 * @param {string}   env
	 * @param {Function} callback
	 */
	Javie = function Javie (env, callback) {
		if (_.isFunction(env)) {
			callback = env;
			env      = null;
		}

		if ((Javie.ENV === env || _.isNull(env)) && _.isFunction(callback)) {
			callback.call(Javie);
		}
	};

	/**
	 * Configuration for Javie
	 * 
	 * @type {Object}
	 */
	Javie.config = {};

	/**
	 * Update Javie configuration information.
	 *
	 * <code>
	 * 		Javie.put('baseUrl', 'http://foobar.com');
	 *
	 * 		Javie.put({
	 * 			'baseUrl': 'http://foobar.com',
	 * 			'foo': 'foo is awesome'
	 * 		});
	 * </code>
	 * 
	 * @param  {mixed} key
	 * @param  {mixed} value
	 * @return {void}
	 */
	Javie.put = function put (key, value) {
		var config = (!_.isString(key)) ? key : { key : value };

		this.config = _.defaults(config, this.config);
	};

	/**
	 * Get Javie configuration information.
	 *
	 * <code>
	 * 		Javie.get('baseUrl', 'http://foobar.com');
	 * </code>
	 * 
	 * @param  {mixed} key
	 * @param  {mixed} _default
	 * @return {void}
	 */
	Javie.get = function get (key, _default) {
		if ( ! _.isUndefined(_default)) _default = null;

		if ( ! _.isUndefined(this.config[key])) return _default;

		return this.config[key];
	};

	/**
	 * Javie Environment value.
	 * 
	 * @type {String}
	 */
	Javie.ENV    = 'production';

	// Append Javie to global.
	root.Javie   = Javie;

}).call(this);

