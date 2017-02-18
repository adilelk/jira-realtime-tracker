module.exports = function(config) {

    this.connection = null;
    this.mysql = require('mysql');
    this.provider = 'mysql';

    this.query = '';
    this.parameters = [],

    this.start = function() {
        this.connection = this.mysql.createConnection({
          host     : config.mysql.host,
          user     : config.mysql.user,
          password : config.mysql.password,
          database : config.mysql.database,
          port     : config.mysql.port
        });

        this.connection.connect(function(err){
            if(err) {
                console.log("Error connecting database, exiting the app.");
                process.exit(1);
            }
        });
    };

    this.select = function(fields) {
        this.query += 'SELECT ';
        if (typeof fields == 'object' && fields.length > 0) {
            this.query += fields.join();
        } else {
            this.query += '*';
        }

        return this;
    };

    this.from = function(table) {
        this.query += ' FROM  ' + table;

        return this;
    };


    this.join = function(table, condition) {
        this.query += ' JOIN ' + table + ' ON ' + condition;

        return this;
    }

    this.leftJoin = function(table, condition) {
        this.query += ' LEFT JOIN ' + table + ' ON ' + condition;

        return this;
    }

    this.rightJoin = function(table, condition) {
        this.query += ' RIGHT JOIN ' + table + ' ON ' + condition;

        return this;
    }

    this.where = function(condition) {
        this.query += ' WHERE ';
        if (typeof condition == 'object') {
            this.query += ' ? ';
        }

        this.parameters = condition;

        return this;
    }

    this.insert = function(table, fields) {
        this.query = "INSERT INTO " + table + ' SET ? ' ;
        this.parameters = fields;

        return this;
    };

    this.update = function(table, fields) {
        this.query = "UPDATE " + table + ' set ? ' ;
        this.parameters = fields;

        return this;
    };

    this.delete = function() {
        this.query = "DELETE " ;

        return this;
    };

    this.union = function() {
        this.query += ' UNION ';

        return this;
    }

    this.execute = function(success, error) {
        var query = this.query;
        console.log(query);
        this.query = '';
        var query = this.connection.query(query, this.parameters, function(err, rows, fields) {
            this.query = '';
            if (err) {
                if (typeof error === "function") {
                    error(err);
                }

                return;
            }

            if (typeof success === "function") {
                success(rows);
            }
        });
    }

    this.init = function() {

        var tables = {
            'projects' : 'create table `projects` ('
                            + '`id` int(11) not null primary key auto_increment,'
                            + '`project_id` VARCHAR(100) not null,'
                            + '`tracker` VARCHAR(100) not null,'
                            + '`project_name` VARCHAR(100) not null'
                         + ');',
            'statuses' : 'create table `statuses` ('
                            + '`id` int(11) not null primary key auto_increment,'
                            + '`name` VARCHAR(100) not null,'
                            + '`project_id` int(11) not null,'
                            + 'constraint `project_fk_1` foreign key (`project_id`) references `projects` (`id`) on delete cascade on update cascade'
                         + ');',
            'users'    : 'create table `users` ('
                             + '`id` int(11) not null primary key auto_increment,'
                             + '`name` VARCHAR(100) not null'
                          + ');',
            'settings' : 'create table `settings` ('
                            + '`id` int(11) not null primary key auto_increment,'
                            + '`hours` int(11) null default 8'
                         + ');',
        };

        var connection = this.connection;
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
    };
}
