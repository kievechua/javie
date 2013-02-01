Javie
=====

Javie Client-side JavaScript Library is simple toolkit written for Client-side JavaScript. The toolkit can be use separately and only requires file that is marked in the documentation. All the object use object combined with factory pattern to make a reusable global instance or multi-instance (depend which is better).

## Javie

`Javie` simplify the way you define your environment, for instance profiler and logger should only run in "dev" invironment.

```javascript
/* Define the environment to `dev` */
Javie.ENV = "dev";

Javie('dev', function initiateDevEnv () {
	// do something on just dev environment.
    this.Profiler.enable();
    this.Logger.enable();
});

Javie('production', function initiateProdEnv () {
    // do something on just production environment.
    this.Profiler.disable();
    this.Logger.disable();
});

Javie(function initiateAllEnv () {
    // this will be run in any environment.
});
```

## Events

`Javie.Events` is a publisher/subscriber object that you can use in your app, in a way it's similar to `jQuery.bind` and `jQuery.trigger` except that the event is not attach to any DOM element.

```javascript
var ev = new Javie.Events;

var say = ev.listen('simon.say', function (say) {
	jQuery('<p>').text(say).appendTo('body');
});

ev.fire('simon.say', ['hello world']);
ev.fire('simon.say', ['good morning']);
ev.fire('simon.say', ['goodbye']);

// the .emit action above will create <p>hello world</p><p>good morning</p><p>goodbye</p>

// to remove an action
ev.forget(say);

// now .emit('say') wouldn't do anything
ev.fire('simon.say', ['does not output anything']);
```

In Javie, we use `Javie.Events` on top of `Javie.Request` to allow you to add attach event to any `Javie.Request` call. Let say you want to get the amount of time it took for each request.

```javascript
var ev, p;

ev = Event.make();
p  = Profiler.make();

ev.listen('Request.beforeSend', function (self) {
	p.time(self.get('name') + '.request', 'Time taken for the request');
});

ev.listen('Request.onComplete', function (data, status, self) {
	p.timeEnd(self.get('name') + '.request');
});
```

## License

	The MIT License

	Copyright (C) 2012 by Mior Muhammad Zaki <http://git.io/crynobone> 

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.