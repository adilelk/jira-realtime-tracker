module.exports = function(socket, tracker) {
    socket.on('listProjects', function(data) {
        tracker.listProjects(
            function(projects) {
                socket.emit('listProjectsSuccess', projects);
            },
            function(data) {
                socket.emit('listProjectsFailed', data);
            }
        );
    });
}
