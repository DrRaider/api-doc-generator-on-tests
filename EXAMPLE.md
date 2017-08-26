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
       },
       "author": {
         "name": {
           "type": "string"
         },
         "email": {
           "type": "email"
         }
       }
     }
```

# Methods

## Brief
 - [/books](#methods.books)
   - [get](#methods.books.get)
   - [post](#methods.books.post)
 - [/books/:bookId](#methods.books/:bookId)
   - [get](#methods.books/:bookId.get)
   - [delete](#methods.books/:bookId.delete)
 - [/books/:bookId/readers](#methods.books/:bookId/readers)
   - [get](#methods.books/:bookId/readers.get)

## <a name="methods.books"></a> /books
Method | Description
-------|------------
get | Get information about all books
post | Add new book

### <a name="methods.books.get"></a> get
Get information about all books

**Responses**

code | type | example
-----|------|--------
200 |application/json | ```[{"name":"one", "author":{"name":"Art"}}]```
404 |application/json | ```{"code":"120", "message":"Books not found"}```

### <a name="methods.books.post"></a> post
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


## <a name="methods.books/:bookId"></a> /books/{bookId}
Method | Description
-------|------------
get | Get information about {bookId} book
delete | Delete {bookId} book

### <a name="methods.books/:bookId.get"></a> get
Get information about {bookId} book

**Responses**

code | type | example
-----|------|--------
200 |application/json | ```{"_id":123, "name":"one", "author":{"name":"Art"}}```
404 |application/json | ```{"code":"121", "message":"Book not found"}```

### <a name="methods.books/:bookId.delete"></a> delete
Delete {bookId} book

**Responses**

code | type | example
-----|------|--------
200 |application/json | ```{"ok":1, "_id":123}```
400 |application/json | ```{"code":"221", "message":"name not matched with string type"}```
404 |application/json | ```{"code":"121", "message":"Book not found"}```


## <a name="methods.books/:bookId/readers"></a> /books/{bookId}/readers
Method | Description
-------|------------
get | Get information about who has read {bookId} book

### <a name="methods.books/:bookId/readers.get"></a> get
Get information about who has read {bookId} book

**Responses**

code | type | example
-----|------|--------
200 |application/json | ```[{"_id":343, "name":"Mike"}, {"_id":324, "name":"John"}]```
404 |application/json | ```{"code":"121", "message":"Readers not found"}```

