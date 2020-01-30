// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express = require('express');
const { default: ParseServer, ParseGraphQLServer } = require('parse-server');
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('MISSING DATABASE URI');
}

var api = new ParseServer({
  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY, //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  publicServerURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
});

const parseGraphQLServer = new ParseGraphQLServer(
  parseServer,
  {
    graphQLPath: '/graphql',
    playgroundPath: '/playground'
  }
);

app.use('/parse', parseServer.app); // (Optional) Mounts the REST API
parseGraphQLServer.applyGraphQL(app); // Mounts the GraphQL API
parseGraphQLServer.applyPlayground(app); // (Optional) Mounts the GraphQL Playground - do NOT use in Production

app.listen(1337, function() {
  console.log('REST API running on http://localhost:1337/parse');
  console.log('GraphQL API running on http://localhost:1337/graphql');
  console.log('GraphQL Playground running on http://localhost:1337/playground');
});
