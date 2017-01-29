//loading express
var express = require('express');
var app = express();

//loading http server
var server = require('http').createServer(app);

//Loading socket io
var io = require('socket.io')(server);

//serving static files in the public folder (css, js, images)
var statics = require('./public');
statics.serve(app, express);

//Loading routes
var routes = require('./routes')(app);

//Using ejs as a templating engine
var engine = require('ejs-locals');
var path = require("path");
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

//loading neo4j as a database
var neo4j = require('neo4j-driver').v1;

//Loading the configuration file
var config = require('./config')

//loading the client that was activated in the configuration file
var trackerFactory = require('./trackers/'+config.activeTracker).factory;
var tracker = new trackerFactory(config);

//using database defined in configuration
var dbFactory = require('./database/'+config.database).factory;
var database = new dbFactory(config);
database.init();
//Creating controllers that will treat every io socket request emitted
var socket = require('./controller')(io, tracker, database);


/*var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo4j"));
var session = driver.session();
session
  .run( "CREATE (a:Person {name:'Arthur', title:'King'})" )
  .then( function()
  {
    return session.run( "MATCH (a:Person) WHERE a.name = 'Arthur' RETURN a.name AS name, a.title AS title" )
  })
  .then( function( result ) {
    console.log( result.records[0].get("title") + " " + result.records[0].get("name") );
    session.close();
    driver.close();
  });
*/



console.log('Listening on port 3000...');
server.listen(3000);
