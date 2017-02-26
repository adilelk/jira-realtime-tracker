module.exports = function() {
    this.load = function(config) {
        try {
            var database = new (require('./'+config.database))(config);
            database.start();

            return database;
        } catch (ex) {
            throw 'Could not load ' + config.database + ' database';
        }
    }
}
