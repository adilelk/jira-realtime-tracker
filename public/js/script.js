//var socket = io.connect('http://localhost:3000');
Vue.use(VueSocketio, 'http://localhost:3000');
window.addEventListener('load', function () {

    /*****************************************************************************************/
    /********************************* Menu Vue Manager ***********************************/
    vmMenu = new Vue({
        el: '#menu',
        data: {
            menu: [
                {
                    id: 'dashboard',
                    label: "Dashboard",
                    class: "fa fa-dashboard",
                    url: "/",
                },
                {
                    id: 'settings',
                    label: "Settings",
                    class: "fa fa-gear",
                    url: "/settings"
                }
            ],
            colors: [
                'yellow',
                'red',
                'aqua',
                'blue',
                'green',
                'gray',
                'fuchsia',
                'purple',
                'maroon',
                'lime',
                'teal',
                'orange',
                'light-blue',
                'teal',
                'olive',
            ]
        },
        mounted : function() {
            this.render();
        },
        methods:
        {
            render: function() {
                this.$socket.emit('listSelectedProjects');
            }
        },
        sockets:{
            listSelectedProjectsSuccess: function(projects) {
                var indexColors = 0;
                vmMenu.$data.menu = vmMenu.$data.menu.slice(0, 2);
                projects.forEach(function(project) {
                    let menuLine = {
                        id: project.project_name,
                        label: "Project " + project.project_name,
                        class: "fa fa-circle-o text-" + vmMenu.$data.colors[indexColors++],
                        url: "/tracking?id=" + project.project_name
                    };
                    if (indexColors > vmMenu.$data.colors.length) {
                        indexColors = 0;
                    }
                    vmMenu.$data.menu.push(menuLine);
                });
            },
        }
    });
});
