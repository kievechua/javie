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