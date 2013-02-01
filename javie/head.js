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

	Javie = function Javie (env, callback) {
		if (_.isFunction(env)) {
			callback = env;
			env      = null;
		}

		if ((Javie.ENV === env || _.isNull(env)) && _.isFunction(callback)) {
			callback.call(Javie);
		}
	};


	Javie.ENV  = 'production';
	root.Javie = Javie;

}).call(this);

