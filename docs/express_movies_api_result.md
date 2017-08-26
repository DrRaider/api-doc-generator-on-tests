# Movies Database
v1

BaseUri: [http://127.0.0.1:3000](http://127.0.0.1:3000)

# Methods

## Brief
 - [//api.md](#methods./api.md)
   - get
 - [//movies](#methods./movies)
   - [get](#methods./movies.get)
   - [post](#methods./movies.post)
 - [//movies/:id](#methods./movies/:id)
   - [get](#methods./movies/:id.get)
   - [delete](#methods./movies/:id.delete)
 - [//movies/:id/actors](#methods./movies/:id/actors)
   - [get](#methods./movies/:id/actors.get)

## <a name="methods./api.md"></a> /api.md
Method | Description
-------|------------
get | List all api.md


## <a name="methods./movies"></a> /movies
Method | Description
-------|------------
get | List all movies
post | Insert a new record in to movie collection

### <a name="methods./movies.get"></a> get
List all movies

**Responses**

code | type | example
-----|------|--------
200 |application/json | ```{"1":{"name":"Shaun of the Dead", "year":2004}, "2":{"name":"Hot Fuzz", "year":2007}}```

### <a name="methods./movies.post"></a> post
Insert a new record in to movie collection

**Body**

type | body | example
-----|------|--------
application/json | [](#types.) | {"id":3, "name":"The World's End", "year":2013}

**Responses**

code | type | example
-----|------|--------
201 |application/json | ```{"id":3, "name":"The World's End", "year":2013}```
409 |application/json | ```{"error":"id exists"}```


## <a name="methods./movies/:id"></a> /movies/{id}
Method | Description
-------|------------
get | Get movie with ID {id}
delete | Delete movie with ID {id}

### <a name="methods./movies/:id.get"></a> get
Get movie with ID {id}

**Responses**

code | type | example
-----|------|--------
200 |application/json | ```{"name":"Shaun of the Dead", "year":2004}```
404 |application/json | ```{"error":"movie not found"}```

### <a name="methods./movies/:id.delete"></a> delete
Delete movie with ID {id}

**Responses**

code | type | example
-----|------|--------
200 |application/json | ```{"ok":true}```
404 |application/json | ```{"error":"movie not found"}```


## <a name="methods./movies/:id/actors"></a> /movies/{id}/actors
Method | Description
-------|------------
get | List of actors that movie ID {id} owns

### <a name="methods./movies/:id/actors.get"></a> get
List of actors that movie ID {id} owns

**Responses**

code | type | example
-----|------|--------
200 |application/json | ```{}```
