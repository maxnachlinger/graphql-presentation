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
