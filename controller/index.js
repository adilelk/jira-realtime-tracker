
module.exports = function(socket, tracker, database) {
    socket.on('connection', function(client) {
        require('./ProjectsController')(client, tracker);
        require('./StatusesController')(client, tracker);
        require('./UsersController')(client, tracker);
        require('./SettingsController')(client, tracker, database);
    });
}
