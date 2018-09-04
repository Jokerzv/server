# Parse Float

parseFloat for comma sepparated numbers

[![Dependency
Status](https://david-dm.org/nihey/node-parse-float.svg)](https://david-dm.org/nihey/node-parse-float)

# Installation
```
$ npm install parse-float --save
```

# Usage
```
var pf = require('parse-float');

pf('1,2'); // => 1.2
pf('1.000,2'); // => 1000.2
pf('1 000,2'); // => 1000.2
```

# License

This code is released under
[CC0](http://creativecommons.org/publicdomain/zero/1.0/) (Public Domain)
