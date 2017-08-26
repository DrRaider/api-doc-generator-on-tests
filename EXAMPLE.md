# Testing

v3.1.0

BaseUri: [http://localhost:3000](http://localhost:3000)

# Types
## <a name="types.books"></a>books

```     {
       "name": {
         "type": "string",
         "required": true
       },
       "numberOfPages": {
         "type": "integer"
       },
       "author": {
         "name": {
           "type": "string"
         },
         "email": {
           "type": "email"
         }
       }
     }```

# Methods
## /books
Method | Description
-------|------------
get | Get information about all books
post | Add new book

### get
Get information about all books

**Responses**

code | type | example
-----|------|--------
200 |application/json | ```[{"name":"one", "author":{"name":"Art"}}]```
404 |application/json | ```{"code":"120", "message":"Books not found"}```

### post
Add new book

**Body**

type | body | example
-----|------|--------
application/json | [books](#types.books) | {"name":"one", "author":{"name":"Art"}}

**Responses**

code | type | example
-----|------|--------
201 |application/json | ```{"name":"one", "author":{"name":"Art"}}```
400 |application/json | ```{"code":"221", "message":"name not matched with string type"}```

## /books/{bookId}
Method | Description
-------|------------
get | Get information about {bookId} book
delete | Delete {bookId} book

### get
Get information about {bookId} book

**Responses**

code | type | example
-----|------|--------
200 |application/json | ```{"_id":123, "name":"one", "author":{"name":"Art"}}```
404 |application/json | ```{"code":"121", "message":"Book not found"}```

### delete
Delete {bookId} book

**Responses**

code | type | example
-----|------|--------
200 |application/json | ```{"ok":1, "_id":123}```
400 |application/json | ```{"code":"221", "message":"name not matched with string type"}```
404 |application/json | ```{"code":"121", "message":"Book not found"}```

## /books/{bookId}/readers
Method | Description
-------|------------
get | Get information about who has read {bookId} book

### get
Get information about who has read {bookId} book

**Responses**

code | type | example
-----|------|--------
200 |application/json | ```[{"_id":343, "name":"Mike"}, {"_id":324, "name":"John"}]```
404 |application/json | ```{"code":"121", "message":"Readers not found"}```
