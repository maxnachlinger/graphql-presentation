## graphql-presentation

- [Setup](#setup)
- [Start](#start)
- [Queries](#queries)
  - [People info](#people-info)
  - [People with their addresses](#people-with-their-addresses)
  - [Info about a single person](#info-about-a-single-person)
- [Programmatic queries](#programmatic-queries)
- [Mutations](#mutations)
  - [Add a new person with one address](#add-a-new-person-with-one-address)
  - [Update a person along with their address](#update-a-person-along-with-their-address)
  - [Delete a person along with their addresses](#delete-a-person-along-with-their-addresses)
- [Database ERD Diagram](#database-erd-diagram)

### Setup:
This app requires mysql

```shell
npm i 

# setup the db
mysql -u root -p<root-password> < ./scripts/db.sql

# setup a user for our app
mysql -u root -p<root-password> < ./scripts/create-app-user.sql
```

### Start:
```shell
npm start
```

### Queries 
You can use the [graphiql](http://localhost:3000/graphiql) end-point to issue queries.

### Example queries
#### People info:
```typescript
query {
  people(username:"") {
    id
    firstName
    lastName
    username
    email
  }
}
```
#### People with their addresses:
```typescript
query {
  people(username:"") {
    id
    firstName
    lastName
    username
    email
    addresses {
      id
      addressTypeId
      address
      address2
      district
      city
      postalCode
    }
  }
}
```
#### Info about a single person:
```typescript
query {
  people(username:"cmoyers0") {
    id
    firstName
    lastName
    username
    email
    addresses {
      id
      addressTypeId
      address
      address2
      district
      city
      postalCode
    }
  }
}
```

### Programmatic queries:

Here's an example of sending a query to this API programmatically:
```javascript
'use strict';
/* eslint-disable no-console */

const requestPromise = require('request-promise');

const query = `query people($username:String) {
  people(
    username:$username
  ) {
    id
    firstName
    lastName
    username
    email
    addresses {
      id
      addressTypeId
      address
      address2
      district
      city
      postalCode
    }
  }
}`;

requestPromise({
  method: 'POST',
  uri: 'http://localhost:3000/graphql',
  body: {
    query,
    variables: {
      username: ''
    }
  },
  json: true
})
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
    // give it a bit to print
    setTimeout(() => process.exit(0), 200);
  })
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });
```
This is example is available [here](example/people-query.js).

### Mutations
#### Add a new person with one address:
```typescript
mutation {
  addPerson(person: {
    firstName: "TestFirst",
    lastName: "TestLast",
    username: "test-username",
    email: "test@walmartlabs.com",
    addresses: [{
      addressTypeId: 1,
      address: "702 S.W. Eighth St.",
      district: "AR",
      city: "Bentonville",
      postalCode: "72716"
    }]
  }) {
    id
  }
}
```
#### Update a person along with their address:
```typescript
mutation {
  updatePerson(person: {
    id: 1001,
    firstName: "TestFirst-updated",
    lastName: "TestLast-updated",
    username: "test-updated",
    email: "test-updated@walmartlabs.com",
    addresses: [{
      addressTypeId: 1,
      address: "708 S.W. Ninth St.",
      district: "AR",
      city: "Bentonville",
      postalCode: "72716"
    }]
  }) {
    id
  }
}
```
#### Delete a person along with their addresses:
```typescript
mutation {
  deletePerson(id: 1001) {
    id
  }
}
```

### Database ERD Diagram
![database erd diagram](/doc/db.png)
