
[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]
[![js-standard-style][standard-style-image]][standard-style-url]
[![Build Status: Linux][travis-image]][travis-url]
[![Build Status: Windows][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]


# express2md

### Create API documentation from object or Express.js application

 v1.1.0


## Installation
```npm i -S express2md```


## Create API documentation based on Express.js

### Simple express example

```javascript
var express = require('express');
var Markdown = require('express2md');

var app = express();

var md = new Markdown({ express: app });

// regular app express workflow ( app.get, app.post, app.listen... etc )
```

### Get created md

```curl 127.0.0.1:3000/api.md```


### Extended express example

- [extended Express API example](docs/express_movies_api.md) - movies database API example ( GET, POST, DELETE methods; RAM data storage ). Result example as md: [Movies Database API documentation](docs/express_movies_api_result.md)

### Simple example

```javascript
var express = require('express');
var Markdown = require('express2md');

var app = express();
var md = new Markdown({ express: app });

app.get('/movies', function (req, res) { res.send('List of all movies'); });
app.post('/movies', function (req, res) { res.send('Add new movie'); });
app.get('/movies/:id', function (req, res) { res.send('Get movie by id'); });
app.delete('/movies/:id', function (req, res) { res.send('Delete movie by id'); });

app.listen(3000, function () { console.log('Example app listening on port 3000!'); });
```

```curl 127.0.0.1:3000/api.md```

### Result

```
# Methods

## Brief
 - [//api.md](#methods./api.md)
   - get
 - [//movies](#methods./movies)
   - get
   - post
 - [//movies/:id](#methods./movies/:id)
   - get
   - delete

## <a name="methods./api.md"></a> /api.md
Method | Description
-------|------------
get | get /api.md


## <a name="methods./movies"></a> /movies
Method | Description
-------|------------
get | get /movies
post | post /movies


## <a name="methods./movies/:id"></a> /movies/{id}
Method | Description
-------|------------
get | get /movies/:id
delete | delete /movies/:id
```

## Create API documentation from object

```javascript
var Markdown = require('express2md');
var md = new Markdown({
  title: 'Testing',
  baseUri: 'http://localhost:3000',
  version: '3.1.0',
});

md.type('books', {
  name: { type: 'string', required: true },
  numberOfPages: { type: 'integer' },
});

md.methods('books', 'get', {
  description: 'Get information about all books',
  responses: {
    200: { 'application/json': [{ name: 'one', author: { name: 'Art' } }] },
    404: { 'application/json': { code: '120', message: 'Books not found' } },
  },
});

md.generate(function (err, mdText) {
  console.log(mdText);
});
```


### Result

```
# Testing
v3.1.0

BaseUri: [http://localhost:3000](http://localhost:3000)

# Types
## <a name="types.books"></a> books

```
     {
       "name": {
         "type": "string",
         "required": true
       },
       "numberOfPages": {
         "type": "integer"
       }
     }
```

# Methods

## Brief
 - [/books](#methods.books)
   - [get](#methods.books.get)

## <a name="methods.books"></a> /books
Method | Description
-------|------------
get | Get information about all books

### <a name="methods.books.get"></a> get
Get information about all books

**Responses**

code | type | example
-----|------|--------
200 |application/json | ```[{"name":"one", "author":{"name":"Art"}}]```
404 |application/json | ```{"code":"120", "message":"Books not found"}```
```

## Options parameters

```javascript
var md = new Markdown(options);
```

 - **version** - version of API documentation ( default: 1.0 )
 - **express** - an Express application
 - **path** - path to get API API documentation ( default: /api.md )
 - **storeResponses** - store first response as example ( default: false )
 - **guessAll** - make description quite pretty ( default: false )
 - **title** - title of API in document
 - **baseUri** - URI of API in document
 - **versionAPI** - version of API in document
 - **templateFileName** - path to template


## Tests

```npm test```


## Change Log

[all changes](CHANGELOG.md)


## Created by

Dimitry, 2@ivanoff.org.ua

```curl -A cv ivanoff.org.ua```


[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[standard-style-image]: https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat
[standard-style-url]: https://github.com/airbnb/javascript

[npm-url]: https://npmjs.org/package/express2md
[npm-version-image]: http://img.shields.io/npm/v/express2md.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/express2md.svg?style=flat

[travis-url]: https://travis-ci.org/ivanoff/express2md
[travis-image]: https://travis-ci.org/ivanoff/express2md.svg?branch=master

[appveyor-url]: https://ci.appveyor.com/project/ivanoff/express2md/branch/master
[appveyor-image]: https://ci.appveyor.com/api/projects/status/lp3nhnam1eyyqh33/branch/master?svg=true

[coveralls-url]: https://coveralls.io/github/ivanoff/express2md
[coveralls-image]: https://coveralls.io/repos/github/ivanoff/express2md/badge.svg
