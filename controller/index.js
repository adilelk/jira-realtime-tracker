
module.exports = function(socket, tracker, modelFactory) {
    socket.on('connection', function(client) {
        require('./projectsController')(client, tracker, modelFactory);
        require('./statusesController')(client, tracker, modelFactory);
        require('./usersController')(client, tracker, modelFactory);
        require('./settingsController')(client, tracker, modelFactory);
    });
}
