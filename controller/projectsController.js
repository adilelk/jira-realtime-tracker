"use strict";

module.exports = function(socket, tracker, modelFactory) {

    var projectModel = modelFactory.get('project');

    socket.on('listProjects', function(data) {
        tracker.listProjects(
            function(projects) {

                projects.sort(function(a, b) {
                    return a.key.trim().localeCompare(b.key.trim());
                });

                projectModel.getAll(
                    function (rows) {
                        rows.forEach(function(row) {
                            let project = projects.find(project => project.id === row.project_id);
                            if (typeof project !== "undefined") {
                                project.selected = true;
                            }
                        });
                        socket.emit('listProjectsSuccess',projects);
                    },
                    function (error) {
                        console.log(error);
                        socket.emit('listProjectsFailed', error);
                    }
                );
            },
            function(data) {
                socket.emit('listProjectsFailed', data);
            }
        );
    });

    socket.on('saveProject', function(project) {

        var projectModel = modelFactory.get('project');

        projectModel.get(
            {project_name: project.key},
            function(rows) {
                projectModel.init();
                projectModel.projectId = project.id;
                projectModel.projectName = project.key;
                projectModel.tracker = tracker.name;
                projectModel.save(
                    function() {

                    },
                    function(error) {
                        console.log(error);
                    }
                )

            },
            function(error) {
                console.log(error);
            }
        );
    });

    socket.on('deleteProject', function(project) {
        var projectModel = modelFactory.get('project');
        projectModel.delete(
            {project_name: project.key},
            function(result) {
                
            },
            function(error) {
                console.log(error);
            }
        );
    });

    socket.on('listSelectedProjects', function(project) {
        var projectModel = modelFactory.get('project');
        projectModel.getAll(
            function (rows) {
                socket.emit('listSelectedProjectsSuccess',rows);
            },
            function (error) {
                socket.emit('listSelectedProjectsFailed', error);
            }
        );
    });


}
