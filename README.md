# Document your API while running your tests

[![MIT License][license-image]][license-url]
[![Build Status: Linux][travis-image]][travis-url]

## Installation

```yarn add api-doc-generator-on-tests```

## Create API documentation based on Express.js

### Simple express example

```javascript
var express = require('express');
var Markdown = require('api-doc-generator-on-tests');

var app = express();

Markdown({
      express: app,
      path: '/api.md', // path to API API documentation
      storeResponses: true, // store first response as example
      guessAll: true, // make description quite pretty
      title: 'docTitle',
    });

// regular app express workflow ( app.get, app.post, app.listen... etc )
```

### Add doc generation on each route test

```javascript
before(async () => {
    server = await createServer({ docTitle: 'Best API Ever' });
  });

  after(async () => {
    const documentation = await apiRequest.get('api.md');
    await fs.writeFile(`${__dirname}/../../../documentation/best-api-ever.md`, documentation.text);
    await closeServer(server);
  });

// run your tests  
```

### Result example

<pre>
# Methods

## Brief
 - [/api.md](#methods./api.md)
   - get
 - [/movies](#methods./movies)
   - get
   - post
 - [/movies/:id](#methods./movies/:id)
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
</pre>

## Options parameters

```javascript
var md = new Markdown(options);
```

- **express** - an Express application
- **path** - path to get API API documentation ( default: /api.md )
- **storeResponses** - store first response as example ( default: false )
- **guessAll** - make description quite pretty ( default: false )
- **title** - title of API in document

## Tests

```yarn test```

## Change Log

[all changes](CHANGELOG.md)

## Created by

Nicolas SAILLY

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[travis-url]: https://travis-ci.org/DrRaider/express2md
[travis-image]: https://travis-ci.org/DrRaider/express2md.svg?branch=master
