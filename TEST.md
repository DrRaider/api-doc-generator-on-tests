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
200 |application/json |{<br />  "1": {<br />    "name": "Shaun of the Dead",<br />    "year": 2004<br />  },<br />  "2": {<br />    "name": "Hot Fuzz",<br />    "year": 2007<br />  }<br />}
### post
Insert a new record in to movie collection
code | type | example
-----|------|--------
201 |application/json |{<br />  "name": "Unknwn",<br />  "year": 2017<br />}

## /movies/{id}
Method | Description
-------|------------
get | Get movie with ID {id}
delete | Delete movie with ID {id}
### get
Get movie with ID {id}
code | type | example
-----|------|--------
200 |application/json |{<br />  "name": "Shaun of the Dead",<br />  "year": 2004<br />}
### delete
Delete movie with ID {id}
code | type | example
-----|------|--------
200 |application/json |{<br />  "ok": true<br />}

## /movies/{id}/actors
Method | Description
-------|------------
get | List of actors that movie ID {id} owns
### get
List of actors that movie ID {id} owns
code | type | example
-----|------|--------
200 |application/json |{}
