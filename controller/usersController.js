module.exports = function(socket, tracker) {
    socket.on('listUsers', function(project) {
        tracker.listUsers(
            project,
            function(users) {
                socket.emit('listUsersSuccess', {project: project, items: users});
            },
            function(data) {
                socket.emit('listUsersFailed',  {project: project, users: [], error: data});
            }
        );
    });
}
