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
POST | [/users](#create-users) | Create a new user
GET | [/users](#get-users) | Get all users
GET | [/users/:id](#get-a-user) | Get details of a specific user
PUT | [/users/:id](#update-user) | Edit user details
DELETE | [/users/:id](#delete-user) | Remove a user fro0m storage
POST | [/users/login](#login) | To log a user in
POST | [/users/logout](#logout) | Log a user out

**Roles**

Request type | Endpoint | Action
------------ | -------- | ------
POST | [/roles/create](#create-role) | Create a new role
GET | [/roles](#get-roles) | Get all created roles
PUT | [/roles/:id](#create-role) | Update a new role
DELETE | [/users/:id](#delete-user) | Delete a role

**Documents**

Request type | Endpoint | Action
------------ | -------- | ------
POST | [/documents](#create-document) | Create a new document
GET | [/documents](#get-documents) | Retrieve all documents
GET | [/documents/:id](#get-a-document) | Retrieve a specific document
GET | [/users/:id/documents](#get-documents-by-user) | Retrieve all documents created by a user
GET | [/documents?offset=1&limit=10](#get-documents) | Retrieve maximum of first 10 documents
PUT | [/documents/:id](#update-document) | Update a specific document
DELETE | [/documents/:id](#delete-document) | Remove a specific document from storage

Users
-----

## Create Users
To create a new user, make a **POST** request to `/users`
#### Request
```
{
  "id: 1,
  "firstName": "Jane",
  "lastName": "Doe",
  "username": "janedoe",
  "email": "janedoe@mail.com",
  "password": "secretkey",
  "roleId": "1"
}
```
#### Mock Response
```
{
  token: "d98whIHSKJHAKdskljEEWRjsdodsjci8943dsklwocklc202f29f",
  message: 'Your registration was succesful',
  expiresIn: 86400,
  userInfo : {
  "id: 1,
  "firstName": "Jane",
  "lastName": "Doe",
  "username": "janedoe",
  "email": "janedoe@mail.com",
  "roleId": "1"
}
}
```

## Get Users
Fetches all user details.
#### Request
  - Endpoint: **GET**: `/users`
  - Requires `Authorization` header to be set
#### Mock Response
```
  [
    {
      "id": "1",
      "firstName": "Jane",
      "lastName": "Doe",
      "username": "janedoe",
      "email": "janedoe@mail.com",
      "roleId": "1",
      "createdAt": "2016-12-06T09:25:29.316Z",
      "updatedAt": "2016-12-06T09:25:29.316Z"
    }, {
      "id": "2",
      "firstName": "Dead",
      "lastName": "Pool",
      "username": "deadpool",
      "email": "deadpool@mail.com",
      "roleId": "2",
      "createdAt": "2016-12-06T09:25:29.316Z",
      "updatedAt": "2016-12-06T09:25:29.316Z"
    }
  ]
```

## Get a User
Get details for a specific user.
#### Request
  - Endpoint: **GET**: `/users/:id`
  - Requires `Authorization` header to be set
#### Mock Response
```
  {
    "id": "1",
    "firstName": "Jane",
    "lastName": "Doe",
    "username": "janedoe",
    "email": "janedoe@mail.com",
    "roleId": "1",
    "createdAt": "2016-12-06T09:25:29.316Z",
    "updatedAt": "2016-12-06T09:25:29.316Z"
  }
```

## Update user
#### Request
  - Enpoint: **PUT**: `/users/:id`
  - Requires `Authorization` header to be set
```
{
  {
     "firstName": "Doctor",
     "lastName": "Strange",
  }
}
```
#### Mock Response
Body (application/json)
```
 {
  message: 'Your details have beeen updated',
  updatedUser: {
    "firstName": "Doctor",
    "lastName": "Strange",
    "username": "janedoe",
    "email": "janedoe@mail.com",
    "roleId": "2",
  }
}
```

## Delete user
#### Request
  - Enpoint: **DELETE**: `/users/:id`
  - Requires `Authorization` header to be set
#### Mock Response
Body (application/json)
```
  {
    message: 'Successfully Deleted.'
  }
```

## Login
#### Request
  - Endpoint: **POST**: `/users/login`
  - Body (application/json)
```
{
  "email": "janedoe@mail.com",
  "password": "secretkey",
}
```
#### Mock Response
Body (application/json)
```
{
  status: 200,
  message: 'Successfully logged In','Welcome to the Document Management System'
}
```


## Logout
#### Request
  - Enpoint: **POST**: `/users/logout`
  - Requires `Authorization` header to be set

#### Mock Response
Body (application/json)
```
  {
    message: 'Logged out successfully!.'
  }
```

ROLES
-----
## Create Role
#### Request
  - Endpoint **POST** `/roles/create`
  - Requires `Authorization` header to be set
Body (application/json)
```
{
  "roleTitle": "admin"
}
```
#### Mock Response
Body (application/json)
```
{
  status: 200,
  message: 'Successfully created'
}
```

## Get Roles
#### Request
  - Endpoint **GET** `/roles`
  - Requires `Authorization` header to be set

#### Mock Response
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
  - Endpoint **POST** `/documents`
  - Requires `Authorization` header to be set
```
{
  "title": "Marvel",
  "content": "Diary of a movie addict",
  "owner": "mcdonalds"
  "type": "private"
}
```
#### Mock Response
  - Body `(application/json)`
```
{
  status: 200,
  message: 'Document created'
}
```
## Get Document
#### Request
  - Endpoint **GET** `/documents`
  - Optional queries **page** (for the page number) && **limit** (number of documents per page)
  - Requires `Authorization` header to be set

#### Mock Response
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
  - Endpoint **GET** `/documents/:id` where id is the id of the document
  - Requires `Authorization` header to be set

##### Mock Response
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
  - Endpoint **GET** `/users/:id/documents` id is the id of the user
  - Requires `Authorization` header to be set
#### Mock Response
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
  - Endpoint **PUT** `/documents/:id` id is the id of the document
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
#### Mock Response
```
{
  status: 200,
  message: 'Successfully deleted'
}
```
