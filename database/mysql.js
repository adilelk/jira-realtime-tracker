exports.factory = function(config) {

    mysql = require('mysql');

    var connection = mysql.createConnection({
      host     : config.mysql.host,
      user     : config.mysql.user,
      password : config.mysql.password,
      database : config.mysql.database,
      port     : config.mysql.port
    });

    connection.connect(function(err){
        if(!err) {
            console.log("Database is connected");
        } else {
            console.log("Error connecting database, exiting the app.");
            process.exit(1);
        }
    });

    this.init = function() {

        var tables = {
            'projects' : 'create table `projects` ('
                            + '`id` int(11) not null primary key auto_increment,'
                            + '`name` int(11) not null'
                         + ');',
            'statuses' : 'create table `statuses` ('
                            + '`id` int(11) not null primary key auto_increment,'
                            + '`name` int(11) not null,'
                            + '`project_id` int(11) not null,'
                            + 'constraint `project_fk_1` foreign key (`project_id`) references `projects` (`id`) on delete cascade on update cascade'
                         + ');',
            'settings' : 'create table `settings` ('
                            + '`id` int(11) not null primary key auto_increment,'
                            + '`hours` int(11) null default 8'
                         + ');',
        };

        connection.query('SHOW TABLES;', function(err, rows, fields) {

            var existingTables = [];
            rows.forEach(function(row) {
                existingTables.push(row['Tables_in_' + config.mysql.database])
            });

            Object.keys(tables).forEach(function(table) {
                if (existingTables.indexOf(table) < 0) {
                    connection.query(tables[table], function(err, rows, fields) {
                        if (!err) {
                            console.log('creating table ' + table);
                        }
                    });
                }
            });
        });
    }

    /*connection.query('SELECT * from user LIMIT 2', function(err, rows, fields) {
    connection.end();
      if (!err)
        console.log('The solution is: ', rows);
      else
        console.log('Error while performing Query.');
      });
    });*/

}
