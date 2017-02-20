module.exports = function(socket, tracker, modelFactory) {

    socket.on('listStatuses', function(project) {
        tracker.listStatuses(
            function(statuses) {
                statuses.sort(function(a, b) {
                    return a.name.trim().localeCompare(b.name.trim());
                });
                socket.emit('listStatusesSuccess', statuses);
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
