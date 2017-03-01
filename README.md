**TravisCI**
[![Coverage Status](https://coveralls.io/repos/github/andela-sayidu/dms-api/badge.svg?branch=dev)](https://coveralls.io/github/andela-sayidu/dms-api?branch=dev)
**Codeclimate**
# Document Managemet System
Document Management System API contains API endpoints which allows users to create, edit, retrieve and delete documents.
It also offers a way to ensure that only authorized users can perform certain operations.

Development
-----------
The application was developed with [NodeJs](http://nodejs.org) while using [Express](http://expressjs.com) for routing.
 The [Postgres](http://postgresql.com) database was used with [sequelize](http://sequelizejs.com) as the ORM

Installation
------------
1.  Ensure you have NodeJs and postgres installed
2.  Clone the repository `git clone https://github.com/andela-sayidu/dms-api.git`
3.  Change your directory `cd dms-api`
4.  Install all dependencies `npm install`
5.  Run tests  `npm test`
6.  Start the app `npm start` and use [postman](https://www.getpostman.com/) to consume the API

## API ENDPOINTS
**Users**

Request type | Endpoint | Action
------------ | -------- | ------
POST | [/api/users](#create-users) | Create a new user
GET | [/api/users](#get-users) | Get all users
GET | [/api/users/:id](#get-a-user) | Get details of a specific user
PUT | [/api/users/:id](#update-user) | Edit user details
DELETE | [/api/users/:id](#delete-user) | Remove a user from storage
POST | [/users/login](#login) | To log a user in

**Roles**

Request type | Endpoint | Action
------------ | -------- | ------
POST | [/api/roles/create](#create-role) | Create a new role
GET | [/api/roles](#get-roles) | Get all created roles

**Documents**

Request type | Endpoint | Action
------------ | -------- | ------
POST | [/api/documents](#create-document) | Create a new document
GET | [/api/documents](#get-documents) | Retrieve all documents
GET | [/api/documents/:id](#get-a-document) | Retrieve a specific document
GET | [/api/users/:id/documents](#get-documents-by-user) | Retrieve all documents created by a user
GET | [api/documents?page=1&limit=10](#get-documents) | Retrieve maximum of first 10 documents
PUT | [/api/documents/:id](#update-document) | Update a specific document
DELETE | [/documents/:id](#delete-document) | Remove a specific document from storage

Users
-----

## Create Users
To create a new user, make a **POST** request to `/api/users`
#### Request
```
{
  "firstName": "Jane",
  "lastName": "Doe",
  "username": "janedoe",
  "email": "janedoe@mail.com",
  "password": "secretkey",
  "role": "admin"
}
```
#### Response
```
{
  status: 200,
  message: 'Successfully registed',
  token: "d98whIHSKJHAKdskljEEWRjsdodsjci8943dsklwocklc202f29f"
}
```

## Get Users
Fetches all users' details,
#### Request
  - Endpoint: **GET**: `/api/users`
  - Requires `Authorization` header to be set
#### Response
```
  [
    {
      "id": "1",
      "firstName": "Jane",
      "lastName": "Doe",
      "username": "janedoe",
      "email": "janedoe@mail.com",
      "role": "admin",
      "createdAt": "2016-12-06T09:25:29.316Z",
      "updatedAt": "2016-12-06T09:25:29.316Z"
    }, {
      "id": "2",
      "firstName": "Dead",
      "lastName": "Pool",
      "username": "deadpool",
      "email": "deadpool@mail.com",
      "role": "regular",
      "createdAt": "2016-12-06T09:25:29.316Z",
      "updatedAt": "2016-12-06T09:25:29.316Z"
    }
  ]
```

## Get A User
#### Request
  - Endpoint: **GET**: `/api/users/:id`
  - Requires `Authorization` header to be set
#### Response
```
  {
    "id": "1",
    "firstName": "Jane",
    "lastName": "Doe",
    "username": "janedoe",
    "email": "janedoe@mail.com",
    "role": "regular",
    "createdAt": "2016-12-06T09:25:29.316Z",
    "updatedAt": "2016-12-06T09:25:29.316Z"
  }
```

## Update user
#### Request
  - Enpoint: **PUT**: `/api/users/:id`
  - Requires `Authorization` header to be set
```
{
  "firstName": "Doctor",
  "lastName": "Strange",
  "username": "docstrange",
  "email": "doctorstrange@marvel.com",
  "password": "astroprojection",
  "role": "1"
}
```
#### Response
Body (application/json)
```
  {
    status: 200,
    message: 'Successfully Updated'
  }
```

## Delete user
#### Request
  - Enpoint: **DELETE**: `/api/users/:id`
  - Requires `Authorization` header to be set
#### Response
Body (application/json)
```
  {
    status: 200,
    message: 'Successfully Deleted.'
  }
```

## Login
#### Request
  - Endpoint: **POST**: `/api/users/login`
  - Body (application/json)
```
{
  "username": "docstrange",
  "password": "astroprojection"
}
```
#### Response
Body (application/json)
```
{
  status: 200,
  message: 'Successfully logged In',
  token: "48J484894NNsdfeofJOIFifUNnowIFiflfjKJ4848wesflfjKJ4848"
}
```

ROLES
-----
## Create Role
#### Request
  - Endpoint **POST** `/api/roles/create`
  - Requires `Authorization` header to be set
Body (application/json)
```
{
  "roleTitle": "admin"
}
```
#### Response
Body (application/json)
```
{
  status: 200,
  message: 'Successfully created'
}
```

## Get Roles
#### Request
  - Endpoint **GET** `/api/roles`
  - Requires `Authorization` header to be set

#### Response
```
[
    {
      "id": 1,
      "roleTitle": "admin",
      "createdAt": "2016-12-06T09:25:29.316Z",
      "updatedAt": "2016-12-06T09:25:29.316Z"
    },
    {
      "id": 1,
      "rowTitle": "regular",
      "createdAt": "2016-13-06T09:25:29.316Z",
      "updatedAt": "2016-13-06T09:25:29.316Z"
    }
]
```

DOCUMENTS
---------
## Create Document
#### Request
  - Endpoint **POST** `/api/documents`
  - Requires `Authorization` header to be set
```
{
  "title": "Marvel",
  "content": "Diary of a movie addict",
  "owner": "mcdonalds"
  "type": "private"
}
```
#### Response
  - Body `(application/json)`
```
{
  status: 200,
  message: 'Document created'
}
```
## Get Document
#### Request
  - Endpoint **GET** `/api/documents`
  - Optional queries **page** (for the page number) && **limit** (number of documents per page)
  - Requires `Authorization` header to be set

#### Response
```
[
  {
    "title": "Marvel",
    "content": "Diary of a movie addict",
    "role": "admin",
    "owner": "mcdonalds",
    "type: "private",
    "createdAt": "2016-13-06T09:25:29.316Z",
    "updatedAt": "2016-13-06T09:25:29.316Z"
  },
  {
    "title": "The accountant",
    "content": "J.K simmons was in the movie as well as Ben Affleck, one of my fav",
    "role": "regular",
    "owner": "mcdonalds",
    "type: "public",
    "createdAt": "2016-13-06T09:25:29.316Z",
    "updatedAt": "2016-13-06T09:25:29.316Z"
  }
]
```

## Get A Document
#### Request
  - Endpoint **GET** `/api/documents/:id` where id is the id of the document
  - Requires `Authorization` header to be set

##### Response
```
{
  "title": "Marvel",
  "content": "Diary of a movie addict",
  "role": "admin",
  "owner": "mcdonalds",
  "type: "private",
  "createdAt": "2016-13-06T09:25:29.316Z",
  "updatedAt": "2016-13-06T09:25:29.316Z"
}
```

## Get Documents By User
#### Request
  - Endpoint **GET** `/api/users/:id/documents` id is the id of the user
  - Requires `Authorization` header to be set
#### Response
```
[
  {
    "title": "The accountant",
    "content": "J.K simmons was in the movie as well as Ben Affleck, one of my fav",
    "role": "admin",
    "owner": "mcdonalds",
    "type: "public",
    "createdAt": "2016-13-06T09:25:29.316Z",
    "updatedAt": "2016-13-06T09:25:29.316Z"
  }
]
```

## Update Document
#### Request
  - Endpoint **PUT** `/api/documents/:id` id is the id of the document
  - Requires `Authorization` header to be set
```
{
  "title": "The accountant",
  "content": "J.K simmons was in the movie as well as Ben Affleck, one of my fav",
  "role": "admin",
  "owner": "mcdonalds",
  "type: "private"
}
```

## Delete Document
#### Request
  - Endpoint **DELETE** `/documents/:id`id of the document
  - Requires `Authorization` header to be set
#### Response
```
{
  status: 200,
  message: 'Successfully deleted'
}
```
