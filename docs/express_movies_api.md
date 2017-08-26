# express2md

[back to readme](../README.md)

## Movies database API example ( GET, POST, DELETE methods; RAM data storage )

Result example as html: [Movies Database API documentation](express_movies_api_result.md)


### Install modules

```bash
npm install -S express
npm install -S body-parser
npm install -S express2md
```


### API script

```javascript
var express = require('express');
var bodyParser = require('body-parser');
var Markdown = require('express2md');

var app = express();
app.use(bodyParser.json());

var md = new Markdown({
  express: app,
  path: '/api.md', // path to API API documentation
  storeResponses: true, // store first response as example
  guessAll: true, // make description quite pretty
  title: 'Movies Database',
  baseUri: 'http://127.0.0.1:3000',
  version: '1',
});

var movies = {
  1: { name: 'Shaun of the Dead', year: 2004 },
  2: { name: 'Hot Fuzz', year: 2007 },
};

app.get('/movies', function (req, res) { res.json(movies); });

app.post('/movies', function (req, res) {
  if (movies[req.body.id]) res.status(409).json({ error: 'id exists' });
  else res.status(201).json(movies[req.body.id] = req.body);
});

app.get('/movies/:id', function (req, res) {
  if (movies[req.params.id]) res.json(movies[req.params.id]);
  else res.status(404).json({ error: 'movie not found' });
});

app.delete('/movies/:id', function (req, res) {
  if (movies[req.params.id]) res.json({ ok: delete movies[req.params.id] });
  else res.status(404).json({ error: 'movie not found' });
});

app.get('/movies/:id/actors', function (req, res) { res.json({}); });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
```


### Workflow requests

#### Get all movies

```
curl 127.0.0.1:3000/movies
```
`{"1":{"name":"Shaun of the Dead","year":2004},"2":{"name":"Hot Fuzz","year":2007}}`


#### Get movie by id

```
curl 127.0.0.1:3000/movies/1
```
`{"name":"Shaun of the Dead","year":2004}`


#### Get not exists movie

```
curl 127.0.0.1:3000/movies/3
```
`{"error":"movie not found"}`


#### Add movie

```
curl -X POST -H "Content-Type: application/json" -d '{"id":3,"name":"The World\u0027s End","year":2013}' 127.0.0.1:3000/movies
```
`{"id":3,"name":"The World's End","year":2013}`

```
curl 127.0.0.1:3000/movies
```
`{"1":{"name":"Shaun of the Dead","year":2004},"2":{"name":"Hot Fuzz","year":2007},"3":{"id":3,"name":"The World's End","year":2013}}`


#### Add movie with exists id

```
curl -X POST -H "Content-Type: application/json" -d '{"id":3,"name":"Paul"}' 127.0.0.1:3000/movies
```
`{"error":"id exists"}`

```
curl -X POST -H "Content-Type: application/json" -d '{"id":4,"name":"Paul"}' 127.0.0.1:3000/movies
```
`{"id":4,"name":"Paul"}`


#### Delete movie by id

```
curl -X DELETE 127.0.0.1:3000/movies/4
```
`{"ok":true}`


#### Delete not exists movie

```
curl -X DELETE 127.0.0.1:3000/movies/4
```
`{"error":"movie not found"}`


#### Get list of actors (not implemented)

```
curl 127.0.0.1:3000/movies/1/actors
```
`{}`


### Get API documentation

```bash
curl 127.0.0.1:3000/api.md
```

[result as markdown](express_movies_api_result.md)


## Created by

Dimitry, 2@ivanoff.org.ua

```curl -A cv ivanoff.org.ua```


[back to readme](../README.md)
