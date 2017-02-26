//Loading colors module to make display more readable, made global
var colors = require('colors');


//Loading the configuration file
process.stdout.write('Reading config file....');
try {
    var config = require('./config')
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}


//loading express
process.stdout.write("Loading express....");
try {
    var express = require('express');
    var app = express();
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}

//loading http server
process.stdout.write("Loading http server....");
try {
    var server = require(config.protocol).createServer(app);
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}



//Loading socket io
process.stdout.write("Loading socket io....");
try {
    var io = require('socket.io')(server);
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}

//serving static files in the public folder (css, js, images)
process.stdout.write('Serving static files....');
try {
    var statics = require('./public');
    statics.serve(app, express);
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}

//Loading routes
process.stdout.write('Loading routes....');
try {
    var routes = require('./routes')(app);
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}


//Using ejs as a templating engine
process.stdout.write('Loading ejs templating engine....');
try {
    var engine = require('ejs-locals');
    var path = require("path");
    app.set('views', path.join(__dirname, 'views'));
    app.engine('ejs', engine);
    app.set('view engine', 'ejs');
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}

//loading neo4j as a database
//var neo4j = require('neo4j-driver').v1;

//loading the client that was activated in the configuration file
process.stdout.write('Loading ' + config.activeTracker + ' tracker....');
try {
    var trackerFactory = new (require('./trackers/'))();
    var tracker = trackerFactory.load(config);
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}


//using database defined in configuration
process.stdout.write('Loading ' + config.database + ' database....');
try {
    var dbFactory = new (require('./database'))();
    var database = dbFactory.load(config);
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.stdout.write(exception + '\n');
    process.exit(1);
}

//initializing database
process.stdout.write('Initializing ' + config.database + ' database....');
try {
    database.init();
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.stdout.write(exception + '\n');
    process.exit(1);
}

//Loading models that will intercat with the selected database
process.stdout.write('Loading models classes....');
try {
    var modelFactory =  new (require('./models/'))(database);
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}


//Creating controllers that will treat every io socket request emitted
process.stdout.write('Loading controller classes....');
try {
    var socket = require('./controller')(io, tracker, modelFactory);
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}



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

process.stdout.write(colors.yellow('Listening on port ' + config.port + '...\n'));
server.listen(config.port);
