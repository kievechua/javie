/**
 * Javie Package
 * ==========================================================
 *
 * @package     Javie
 * @require     underscore, console, jQuery/Zepto
 * @since       0.1.1
 * @author      Mior Muhammad Zaki <https://git.io/crynobone>
 * @license     MIT License
 */

(function () { 'use strict';

	var root = this;

	root.Javie = {};

}).call(this);

/**
 * Client-side and Node.js Event Listener Helper
 * ==========================================================
 * 
 * @package     Javie
 * @class       Event
 * @require     underscore
 * @since       0.1.0
 * @author      Mior Muhammad Zaki <https://git.io/crynobone>
 * @license     MIT License
 */

(function () { 'use strict';

	var root, Events, _, cache;

	// Save a reference to the global object (`window` in the browser, `global` on the server)
	root = this;

	// Create a safe reference to the Events object for use below.
	Events = function () {
		return Events.make();
	};

	// Export the object for **Node.js**, with
	// backwards-compatibility for the old `require()` API. If we're in
	// the browser, add `Events` as a global object via a string identifier,
	// for Closure Compiler "advanced" mode.
	if ('undefined' !== typeof exports) {
		if ('undefined' !== typeof module && module.exports) {
			exports = module.exports = Events;
		}

		exports.Events = Events;
	}
	else {
		// Register Javie namespace if it's not available yet.
		if ('undefined' === typeof root.Javie) {
			root.Javie = {};
		}

		root.Javie.Events = Events;
	}

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
	 * Make Event instance or return one from cache.
	 *
	 * <code>
	 *     var ev = Javie.Events.make();
	 * </code>
	 *
	 * @return {Object} Event
	 */
	Events.make = function make() {
		var events, self;

		self = this;

		// Once Events.make is called, we should read it from cache.
		if (!_.isNull(cache) && !_.isUndefined(cache)) {
			return cache;
		}

		events = {};

		cache  = {
			/**
			 * Add an event listener
			 *
			 * <code>
			 *     ev.listen('javie.ready', function () {
			 *         console.log('javie.ready');
			 *     });
			 * </code>
			 *
			 * @param  {String}   id
			 * @param  {Function} cb
			 * @return {Object}
			 */
			listen: function listen (id, cb) {
				if (!_.isFunction(cb)) {
					throw new Error('Callback is not a function');
				}

				if (_.isNull(events[id]) || _.isUndefined(events[id])) {
					events[id] = [];
				}

				events[id].push(cb);

				return { id : id, cb : cb };
			},

			/**
			 * Add an event listener
			 *
			 * <code>
			 *     ev.listener('javie.ready', function () {
			 *         console.log('javie.ready');
			 *     });
			 * </code>
			 *
			 * @deprecated use self::listen()
			 * @param  {String}   id
			 * @param  {Function} cb
			 * @return {Object}
			 */
			listener: function listener (id, cb) {
				return this.listen(id, cb);
			},

			/**
			 * Fire all event associated to an event id
			 *
			 * <code>
			 *     ev.fire('javie.ready');
			 * </code>
			 *
			 * @param  {String} id
			 * @param  {Array} params
			 * @return {Array}
			 */
			fire: function fire (id, params) {
				var me, response;

				me       = this;
				response = [];

				if (_.isNull(id)) {
					throw new Error('Event ID is not provided: [' + id + ']');
				}

				if (_.isNull(events[id]) || _.isNull(events[id])) {
					return null;
				}

				_.each(events[id], function runEachEvent (callback, key) {
					response.push(callback.apply(me, params || []));
				});

				return response;
			},

			/**
			 * Fire only the first event found in the collection
			 *
			 * <code>
			 *     ev.first('javie.ready');
			 * </code>
			 *
			 * @param  {[type]} id     [description]
			 * @param  {[type]} params [description]
			 * @return {[type]}        [description]
			 */
			first: function first (id, params) {
				var me, response, first;

				me       = this;
				response = [];

				if (_.isNull(id)) {
					throw new Error('Event ID is not provided: [' + id + ']');
				}

				if (_.isNull(events[id]) || _.isNull(events[id])) {
					return null;
				}

				first = events[id].slice(0, 1);

				_.each(first, function runEachEvent (callback, key) {
					response.push(callback.apply(me, params || []));
				});

				return response[0];
			},

			until: function until(id, params) {
				var me, response;

				me       = this;
				response = null;

				if (_.isNull(id)) {
					throw new Error('Event ID is not provided: [' + id + ']');
				}

				if (_.isNull(events[id]) || _.isNull(events[id])) {
					return null;
				}

				_.each(events[id], function runEachEvent (callback, key) {
					if (_.isNull(response)) {
						response = callback.apply(me, params || []);
					}
				});

				return null;
			},

			flush: function flush (id) {
				if ( ! _.isUndefined(events[id])) {
					events[id] = null;
				}
			},

			forget: function forget (handler) {
				var me, id, cb;

				me = this;
				id = handler.id;
				cb = handler.cb;

				if (!_.isString(id)) {
					throw new Error('Event ID is not provided: [' + id + ']');
				}

				if (!_.isFunction(cb)) {
					throw new Error('Callback is not a function');
				}

				if (_.isNull(events[id])) {
					throw new Error('No registered event found for [' + id + ']');
				}

				_.each(events[id], function loopEachEvent (callback, key) {
					if (callback === cb) {
						events[id].splice(key, 1);
					}
				});
			},

			/**
			 * Clone original event to a new event.
			 *
			 * <code>
			 *     $event = Javie.Ev
			 * </code>
			 * @param  {[type]} id [description]
			 * @return {[type]}    [description]
			 */
			clone: function clone (id) {
				return {
					to : function to (cloneTo) {
						events[cloneTo] = _.clone(events[id]);
					}
				};
			}
		};

		return cache;
	};

}).call(this);
/**
 * Client-side and Node.js Logger Helper
 * ==========================================================
 *
 * @package     Javie
 * @require     underscore, console
 * @since       0.1
 * @author      Mior Muhammad Zaki <https://github.com/crynobone>
 * @license     MIT License
 */

(function (console) { 'use strict';

	var root, Logger, _, cache;

	// Save a reference to global object (`window` in the browser, `global` on the server)
	root = this;

	// Create a safe reference to the Logger object for use below.
	Logger = function () {
		return Logger.make();
	};

	// Export the object for **Node.js**, with
	// backwards-compatibility for the old `require()` API. If we're in
	// the browser, add `Profiler` as a global object via a string identifier,
	// for Closure Compiler "advanced" mode.
	if ('undefined' !== typeof exports) {
		if ('undefined' !== typeof module && module.exports) {
			exports = module.exports = Logger;
		}

		exports.Logger = Logger;
	}
	else {
		// Register Javie namespace if it's not available yet. 
		if ('undefined' === typeof root.Javie) {
			root.Javie = {};
		}

		root.Javie.Logger = Logger;
	}

	// load all dependencies
	_ = root._;

	// Require Underscore, if we're on the server, and it's not already present.
	if (!_ && ('undefined' !== typeof require)) {
		_ = require('underscore');
	}

	// throw an error if underscore still not available
	if (!_) {
		throw new Error('Expected Underscore.js not available');
	}

	// turn arguments into array
	function makeArray (args) {
		return Array.prototype.slice.call(args);
	}

	/**
	* Allow no conflict for Logger
	*
	* @return {object} Logger
	*/
	Logger.noConflict = function noConflict() {
		root.Logger = previous;
		return this;
	};

	// To allow client-side logging (default to false)
	Logger.enabled = false;

	// constants
	Logger.ERROR   = 'error';
	Logger.WARNING = 'warning';
	Logger.INFO    = 'info';
	Logger.DEBUG   = 'debug';
	Logger.LOG     = 'log';

	// Enable Logger to run in this environment
	Logger.enable = function enable () {
		this.enabled = true;
	};

	// Disable Logger to run in this environment
	Logger.disable = function disable () {
		this.enabled = false;
	};

	// Get Logger enabled status
	Logger.status = function status () {
		return this.enabled;
	};

	Logger.make = function make () {
		var self, post;

		// return instance from cache
		if (!_.isNull(cache) && !_.isUndefined(cache)) {
			return cache;
		}

		self = this;

		// Post message using console.log
		post = function post (type, message) {
			var args;

			if (self.enabled === false) {
				return null;
			}

			args = makeArray(arguments);
			type = args.shift();

			// if there only one index, set output to single string
			if (args.length === 1) {
				args = args[0];
			}

			switch (type) {
			case 'info':
				console.info(args);
				break;
			case 'debug':
				console.debug(args);
				break;
			case 'warning':
				console.warn(args);
				break;
			case 'error':
				console.error(args);
				break;
			case 'log':
				console.log(args);
				break;
			default:
				console.log('[' + type.toUpperCase() + ']', args);
				break;
			}
		};

		cache = {
			// List of cached logs
			logs: [],

			/**
			* log marked as info
			*/
			info: function info () {
				var args;

				args = makeArray(arguments);
				args.unshift(self.INFO);

				this.logs.push(args);
				post.apply(this, args);

				return this;
			},

			/**
			* log marked as debug
			*/
			debug: function debug () {
				var args;

				args = makeArray(arguments);
				args.unshift(self.DEBUG);

				this.logs.push(args);
				post.apply(this, args);

				return this;
			},

			/**
			* log marked as error
			*/
			warning: function warning () {
				var args;

				args = makeArray(arguments);
				args.unshift(self.WARNING);

				this.logs.push(args);
				post.apply(this, args);

				return this;
			},

			/**
			* log marked as error
			*/
			error: function error () {
				var args;

				args = makeArray(arguments);
				args.unshift(self.ERROR);

				this.logs.push(args);
				post.apply(this, args);

				return this;
			},

			/**
			* log marked other than error, debug or info
			*/
			log: function log () {
				var args;

				args = makeArray(arguments);
				args.unshift(self.LOG);

				this.logs.push(args);
				post.apply(this, args);

				return this;
			},

			/**
			* log marked other than error, debug or info (with log type as first parameter)
			*/
			post: function post () {
				var args;

				args = makeArray(arguments);

				this.logs.push(args);
				post.apply(this, args);

				return this;
			}
		};

		return cache;
	};

}).call(this);

/**
 * Client-side and Node.js Profiler Helper
 * ==========================================================
 *
 * @package     Javie
 * @require     underscore, console
 * @since       0.1
 * @author      Mior Muhammad Zaki <https://github.com/crynobone>
 * @license     MIT License
 */

(function (console) { 'use strict';

	var root, Profiler, _, caches;

	// Save a reference to the global object (`window` in the browser, `global` on the server)
	root = this;

	// store collection of Profiler instances, if any.
	caches = {};

	// Create a safe reference to the Profiler object for use below.
	Profiler = function (name) {
		return Profiler.make(name);
	};

	// Export the object for **Node.js**, with
	// backwards-compatibility for the old `require()` API. If we're in
	// the browser, add `Profiler` as a global object via a string identifier,
	// for Closure Compiler "advanced" mode.
	if ('undefined' !== typeof exports) {
		if ('undefined' !== typeof module && module.exports) {
			exports = module.exports = Profiler;
		}

		exports.Profiler = Profiler;
	}
	else {
		// Register Javie namespace if it's not available yet. 
		if ('undefined' === typeof root.Javie) {
			root.Javie = {};
		}

		root.Javie.Profiler = Profiler;
	}
	
	// load all dependencies
	_ = root._;

	// Require Underscore, if we're on the server, and it's not already present.
	if (!_ && ('undefined' !== typeof require)) {
		_ = require('underscore');
	}

	// throw an error if underscore still not available
	if (!_) {
		throw new Error('Expected Underscore.js not available');
	}

	// set default value for logs
	function schema() {
		return {
			id      : '',
			type    : '',
			start   : null,
			end     : null,
			total   : null,
			message : ''
		};
	}

	/**
	 * calculate microtime
	 *
	 * @param  {Boolean}   asFloat
	 * @return {mixed}
	 */
	function microtime (asFloat) {
		var ms, sec;

		ms  = new Date().getTime();
		sec = parseInt(ms / 1000, 10);

		return asFloat ? (ms / 1000) : (ms - (sec * 1000)) / 1000 + ' ' + sec;
	}

	// To allow client-side profiling (default to false)
	Profiler.enabled = false;

	// Enable Profiler to run in this environment
	Profiler.enable  = function enable () {
		this.enabled = true;
	};

	// Disable Profiler to run in this environment
	Profiler.disable = function disable () {
		this.enabled = false;
	};

	// Get Profiler enabled status
	Profiler.status = function status () {
		return this.enabled;
	};

	/**
	* Make Profiler instance or return one from cache.
	*
	* @return {Profiler}
	*/
	Profiler.make = function make (name) {
		var util, self, cache;

		if (console === undefined && this.enabled === true) {
			throw new Error("console is not available.");
		}
		// set a default instance name if none provided
		if (_.isUndefined(name) || name === '') {
			name = 'default';
		}

		// check if instance already exist, load from cache if available
		if (caches[name] !== undefined) {
			return caches[name];
		}

		// shortcode to this library
		self = this;

		// return a new instance (and cache it at the same time)
		cache = {
			/**
			 * List of logs
			 * 
			 * @type {Array}
			 */
			logs: [],

			/**
			 * list of pair id to key
			 * 
			 * @type {Object}
			 */
			pair: {},

			/**
			 * mark initial starting microtime
			 * 
			 * @type {[type]}
			 */
			startedAt: microtime(true),

			/**
			 * Mark start time and return the given ID
			 * 
			 * @param  {String}     id
			 * @param  {String}     message
			 * @return {String}
			 */
			time: function start (id, message) {
				var key, log;

				if (_.isNull(id)) {
					id = this.logs.length;
				}

				if (self.enabled === false) {
					return null;
				}

				log         = schema();
				log.id      = id;
				log.type    = 'time';
				log.message = message.toString();
				log.start   = microtime(true);

				if (!_.isUndefined(this.pair['time.' + id])) {
					key            = this.pair['time.' + id];
					this.logs[key] = log;
				} else {
					this.logs.push(log);
					this.pair['time.' + id] = (this.logs.length - 1);
				}

				console.time(id);

				return id;
			},

			/**
			 * Mark end time
			 *
			 * @param  {String}
			 * @param  {mixed}
			 * @return {Float}
			 */
			timeEnd: function mark (id, message) {
				var key, start, end, total, log;

				if (_.isNull(id)) {
					id = this.logs.length;
				}

				if (self.enabled === false) {
					return;
				}

				if (_.isUndefined(this.pair['time.' + id])) {
					log       = schema();
					log.start = this.startedAt;

					if (util.isSet(message)) {
						log.message = message;
					}

					this.logs.push(log);
					this.pair['time.' + id] = (this.logs.length - 1);

					log.id   = id;
					log.type = 'time';
				} else {
					console.timeEnd(id);
				}

				key   = this.pair['time.' + id];
				log   = this.logs[key];
				end   = log.end = microtime(true);
				start = log.start;
				total = (end - start);

				log.total      = total;
				this.logs[key] = log;

				return total;
			},

			/**
			 * Run console.trace()
			 * 
			 * @return {void}
			 */
			trace: function trace () {
				if (self.enabled === false) {
					return;
				}

				console.trace();
			},

			/**
			 * Output the profiler based on current state
			 *
			 * <code>
			 *    var p = Profiler.make();
			 *    p.mark('page.load', 'Load page');
			 *    p.output();
			 * </code>
			 * 
			 * @param  {Boolean}
			 * @return {void}
			 */
			output: function output (autoEnabled) {
				var logs, index, length, current;

				if (self.enabled === false) {
					if (autoEnabled === true) {
						self.enable();
					} else {
						return;
					}
				}

				logs   = this.logs;
				length = logs.length;

				for (index = 0; index < length; index = index + 1) {
					current = logs[index];

					if ('time' === current.type) {
						console.info('%s: %s - %dms', current.id, current.message, Math.floor(current.total* 1000));
					} else {
						console.log(current.id, current.message);
					}
				}
			}
		};

		caches[name] = cache;

		return caches[name];
	};

}).call(this, console);

/**
 * Client-side Request Helper
 * ==========================================================
 *
 * @package     Javie
 * @require     underscore, jQuery/Zepto
 * @since       0.1.1
 * @author      Mior Muhammad Zaki <http://git.io/crynobone>
 * @license     MIT License
 */

(function () { 'use strict'; 

	var root, Request, _, api, ev, storage;

	// Save a reference to the global object (`window` in the browser, `global` on the server)
	root = this;

	// Create a safe reference to Request object to be used below.
	Request = function (name) {
		return Request.make(name);
	};
	
	storage = {};

	// At this point, we don't have a request wrapper for Node.js implementation. So it would be
	// best to display an exception.
	if ('undefined' !== typeof exports) {
		throw new Error("Not supported");
	}

	if ('undefined' === typeof root.Javie) {
		throw new Error("Javie is required before using Javie.Request");
	}

	root.Javie.Request = Request;

	if ('undefined' === typeof root.Javie.Events) {
		throw new Error("Javie is missing Logger and Events");
	}

	// Load all the dependencies
	ev  = root.Javie.Events.make();
	_   = root._;

	if (!_ && 'undefined' !== typeof require) _ = require('underscore');
	
	// Map jQuery or Zepto instance, but I'm not really into this dollar sign stuff since in 
	// this scope we are focusing on the `ajax` method available from these libraries.
	api = root.$;

	if ('undefined' === typeof api || null === api) {
		throw new Error("Required jQuery or Zepto object is not available.");
	}

	function parseJSON(data) {
		if (_.isString(data)) data = api.parseJSON(data);

		return data;
	};

	/**
	 * Request configuration.
	 * 
	 * @type {Object}
	 */
	Request.config = {
		'baseUrl': null,
		'onError': function onError (data, status) {},
		'beforeSend': function beforeSend (data, status) {},
		'onComplete': function onComplete (data, status) {}
	};

	/**
	 * Update Request configuration information.
	 *
	 * <code>
	 * 		Request.put('baseUrl', 'http://foobar.com');
	 *
	 * 		Request.put({
	 * 			'baseUrl' : 'http://foobar.com',
	 * 			'onError' : function (data, status) { // do something awesome }
	 * 		});
	 * </code>
	 * 
	 * @param  {mixed} key
	 * @param  {mixed} value
	 * @return {void}
	 */
	Request.put = function put(key, value) {
		var config = (!_.isString(key)) ? key : { key : value };

		this.config = _.defaults(config, this.config);
	};

	/**
	 * Make a new Request.
	 *
	 * <code>
	 * 		var r = Javie.Request.make('foo');
	 * </code>
	 * 
	 * @param  {string} name
	 * @return {void}
	 */
	Request.make = function make(name) {
		var cache, child, childName, parent, self;

		if (!_.isString(name)) name = 'default';

		self = this;

		// If cache is not empty, this mean that make was initiated before.
		// we should create child instances if the request has been executed.
		if (!_.isUndefined(storage[name])) {
			parent = storage[name];

			// If parent has been executed, we need to create a child instance.
			if (parent.executed === true) {
				childName = _.uniqueId(name+'_');
				child     = self.make(childName);

				// Replicate all parent configuration to child.
				ev.clone('Request.onError: '+name).to('Request.onError: '+childName);
				ev.clone('Request.onComplete: '+name).to('Request.onComplete: '+childName);
				ev.clone('Request.beforeSend: '+name).to('Request.beforeSend: '+childName);

				child.put(parent.config);

				return child;
			}

			return parent;
		}

		cache = {
			/**
			 * Execution status.
			 * 
			 * @type {Boolean}
			 */
			executed: false,
			
			/**
			 * Create a request wrapper for a form.
			 *
			 * <code>
			 * 		r.to('GET http://google.com?q=foobar', document.getElementById('foo'), 'JSON');
			 * </code>
			 * 
			 * @param  {string}      url
			 * @param  {DOMDocument} object
			 * @param  {string}      dataType e.g: JSON, XML etc.
			 * @return {self}
			 */
			to: function to (url, object, dataType) {
				var own, r, type, uri, tmp;

				own = this;

				if (_.isUndefined(url)) {
					throw new Error('Missing required parameter.');
				}

				if (_.isNull(object)) object = root.document;

				r    = url.split(' ');
				type = "GET";

				own.put({
					'name': name,
					'type': 'GET',
					'query': '',
					'data': '',
					'dataType': (!_.isUndefined(dataType) ? dataType : 'json'),
					'id': '',
					'object': object
				});

				if (r.length === 1) uri = r[0];
				else {
					if (_.indexOf(['POST', 'GET', 'PUT', 'DELETE'], r[0]) > -1) {
						type = r[0];
					}

					uri = r[1];

					if (type !== 'GET') {
						tmp = uri.split('?');
						
						if (tmp.length > 1) {
							uri = tmp[0];
							own.put('query', tmp[1]);
						}
					}

					own.put({
						'type': type,
						'uri': uri
					});
				}

				own.put('id', '#'+api(own.get('object')).attr('id'));

				return this;

			},

			/**
			 * Execute the request.
			 *
			 * <code>
			 * 		r.execute();
			 * </code>
			 * 
			 * @return {void}
			 */
			execute: function execute () {
				var own, data;

				own  = this;
				data = api(own.get('object')).serialize()+'&'+own.get('query');

				if (data === '?&') data = '';

				own.executed = true;

				ev.fire('Request.beforeSend', [own]);
				ev.fire('Request.beforeSend: '+name, [own]);
				own.config.beforeSend(own);

				api.ajax({
					'type': own.get('type'),
					'dataType': own.get('dataType'),
					'url': own.get('uri'),
					'data': data,
					'complete': function complete(xhr) {
						var data, status;

						if (xhr.responseText !== '') {
							data   = parseJSON(xhr.responseText);
							status = xhr.status;

							if (data.hasOwnProperty('errors')) {
								ev.fire('Request.onError', [data.errors, status, own]);
								ev.fire('Request.onError: '+name, [data.errors, status, own]);

								own.config['onError'](data.errors, status, own);

								data.errors = null;
							}

							ev.fire('Request.onComplete', [data, status, own]);
							ev.fire('Request.onComplete: '+name, [data, status, own]);

							own.config.onComplete(data, status, own);
						}
					}
				});
			},

			/**
			 * Request configurations.
			 *
			 * @type {Object}
			 */
			config: {
				'name': '',
				'type': 'GET',
				'uri': '',
				'query': '',
				'data': '',
				'dataType': 'json',
				'id': '',
				'object': null
			},

			/**
			 * Update or overwrite a configuration.
			 * 
			 * @param  {mixed} key
			 * @param  {mixed} value
			 * @return {void}
			 */
			put: function put (key, value) {
				var config = (!_.isString(key) ? key : { key : value });
				this.config = _.defaults(config, this.config);
			},

			/**
			 * Get a configuration value.
			 * 
			 * @param  {string} key
			 * @param  {mixed}  defaults
			 * @return {mixed}
			 */
			get: function get (key, defaults) {
				if (_.isUndefined(defaults)) defaults = null;

				return (!_.isUndefined(this.config[key]) ? this.config[key] : defaults);
			}
		};

		cache.config  = _.defaults(cache.config, self.config);
		storage[name] = cache;

		return storage[name];
	};

}).call(this);