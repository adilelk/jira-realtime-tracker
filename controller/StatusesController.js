module.exports = function(socket, tracker) {
    socket.on('listStatuses', function(project) {
        tracker.listStatuses(
            project,
            function(statuses) {
                statuses.sort(function(a, b) {
                    return a.name.trim().localeCompare(b.name.trim());
                });
                socket.emit('listStatusesSuccess', {project: project, statuses: statuses});
            },
            function(data) {
                socket.emit('listStatusesFailed', {project: project, statuses: [], error: data});
            }
        );
    });
}
