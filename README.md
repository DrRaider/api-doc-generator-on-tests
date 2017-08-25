# express2md

### Create markdown API from Express.js application

 v1.0.1


## Installation
```npm i -S express2md```


## Create markdown based on Express.js

### Simple express example

```javascript
var express = require('express');
var Markdown = require('express2md');

var app = express();

var md = new Markdown({ express: app });

// regular app express workflow ( app.get, app.post, app.listen... etc )
```

### Get created raml

```curl 127.0.0.1:3000/api.md```


## Tests

```npm test```


## Change Log

[all changes](CHANGELOG.md)


## Created by

Dimitry, 2@ivanoff.org.ua

```curl -A cv ivanoff.org.ua```
