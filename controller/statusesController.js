module.exports = function(socket, tracker, modelFactory) {

    socket.on('listStatuses', function(project) {
        tracker.listStatuses(
            project,
            function(statuses) {
                statuses.sort(function(a, b) {
                    return a.name.trim().localeCompare(b.name.trim());
                });
                var statusModel = modelFactory.get('status');
                statusModel.get(
                    ['statuses.id', 'projects.name'],
                    function(rows) {
                        socket.emit('listStatusesSuccess', {project: project, statuses: statuses, selected: rows});
                    },
                    function(error) {
                        console.log(error);
                        socket.emit('listStatusesFailed', {project: project, statuses: [], error: error});
                    }
                );
            },
            function() {
                
            }
        );
    });

    socket.on('saveStatuses', function(statuses) {

        var projectModel = modelFactory.get('project');
        var statusModel = modelFactory.get('status');

        //statusModel.deleteAll();
        statuses.forEach(
            function(status) {
                projectModel.init();
                projectModel.get(
                    {name: status.projectName},
                    function(rows) {
                        if(rows.length != 1) {
                            socket.emit('saveStatusesFailed', rows.length == 0 ? 'project ' + status.project + ' not found': 'Multiple ' + status.project + ' found');
                            return;
                        }
                        statusModel.init();
                        statusModel.name = status.statusName,
                        statusModel.projectId = rows[0].id,
                        statusModel.save();
                        console.log('save ' + statusModel.name);
                    },
                    function(error) {

                    }
                );
            }
        );
    });
}
