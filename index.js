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

app.post('/notify', function( req, res ){
  //send it to slack
  return Parse.Cloud.httpRequest({
    method: 'POST',
    url: 'https://hooks.slack.com/services/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', 
    body: {
      body: JSON.stringify( req.body.data )
    }
  }).then(function(httpResponse) {
    console.log(httpResponse.text);
    res.status(200).send("[accepted]");
  },function(httpResponse) {
    console.error('Request failed with response code ' + httpResponse.status);
    res.sendStatus( httpResponse.status );
  });
});

app.use('/parse', parseServer.app); // (Optional) Mounts the REST API
parseGraphQLServer.applyGraphQL(app); // Mounts the GraphQL API
parseGraphQLServer.applyPlayground(app); // (Optional) Mounts the GraphQL Playground - do NOT use in Production

app.listen(1337, function() {
  console.log('REST API running on http://localhost:1337/parse');
  console.log('GraphQL API running on http://localhost:1337/graphql');
  console.log('GraphQL Playground running on http://localhost:1337/playground');
});
