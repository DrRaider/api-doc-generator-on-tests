# Movies Database
BaseUri :[http://127.0.0.1:3000](http://127.0.0.1:3000)

# Methods
## /api.md
Method | Description
-------|------------
get | List all api.md

## /movies
Method | Description
-------|------------
get | List all movies
post | Insert a new record in to movie collection
### get
List all movies
code | type | example
-----|------|--------
200 |application/json | ```{"1":{"name":"Shaun of the Dead","year":2004},"2":{"name":"Hot Fuzz","year":2007}}```
### post
Insert a new record in to movie collection
code | type | example
-----|------|--------
201 |application/json | ```{"name":"Unknwn","year":2017}```

## /movies/{id}
Method | Description
-------|------------
get | Get movie with ID {id}
delete | Delete movie with ID {id}
### get
Get movie with ID {id}
code | type | example
-----|------|--------
200 |application/json | ```{"name":"Shaun of the Dead","year":2004}```
### delete
Delete movie with ID {id}
code | type | example
-----|------|--------
200 |application/json | ```{"ok":true}```

## /movies/{id}/actors
Method | Description
-------|------------
get | List of actors that movie ID {id} owns
### get
List of actors that movie ID {id} owns
code | type | example
-----|------|--------
200 |application/json | ```{}```
