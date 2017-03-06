window.addEventListener('load', function () {

    /*****************************************************************************************/
    var projectList = Vue.extend({
      props: ['id', 'value', 'description', 'status'],
      template: '#list-projects-template',
      methods: {
        changeStatus: function() {
            this.status = !this.status;
            if (this.status) {
                vmProjects.$socket.emit('saveProject', {id: this.id, key: this.value});
                vmUsers.$socket.emit('listUsers', this.value);
            } else {
                vmProjects.$socket.emit('deleteProject', {id: this.id, key: this.value});
            }
            //refresh the menu
            vmMenu.$socket.emit('listSelectedProjects');
        }
      }
    });
    Vue.component('list-projects', projectList);
    /*****************************************************************************************/

    /*****************************************************************************************/
    var statusesList = Vue.extend({
      props: ['id', 'name', 'description', 'status'],
      template: '#list-statuses-template',
      methods: {
        changeStatus: function() {
            this.status = !this.status;
            if (this.status) {
                vmStatuses.$socket.emit('saveStatus', {id: this.id, key: this.name});
            } else {
                vmProjects.$socket.emit('deleteStatus', {id: this.id, key: this.name});
            }
        }
      }
    });
    Vue.component('list-statuses', statusesList);
    /*****************************************************************************************/


    /*****************************************************************************************/
    var usersList = Vue.extend({
      props: ['id', 'name', 'shortname', 'project', 'status', 'image'],
      template: '#list-users-template',
      methods: {
        changeStatus: function() {
            console.log('ok');
        }
      }
    });
    Vue.component('list-users', usersList);
    /*****************************************************************************************/

    /*****************************************************************************************/
    /********************************* Project Vue Manager ***********************************/
    var vmProjects = new Vue({
        el: '#projects',
        data: {
            projects: []
        },
        mounted : function() {
            this.fetch();
        },
        methods:
        {
            fetch: function() {
                this.$socket.emit('listProjects');
            },
            changeStatus: function() {
                console.log('ok');
            }
        },
        sockets:{
            listProjectsSuccess: function(projects) {
                vmProjects.$data.projects = projects;
                projects.forEach(function(project) {
                    vmUsers.$socket.emit('listUsers', project.key);
                });
            },
            listProjectsFailed: function(projects){
                console.log('could not load list of projects: ' + projects);
            }
        }
    });

    /*****************************************************************************************/
    /********************************* Status Vue Manager ***********************************/
    var vmStatuses = new Vue({
        el: '#statuses',
        data: {
            statuses: []
        },
        mounted : function() {
            this.fetch();
        },
        methods:
        {
            fetch: function() {
                this.$socket.emit('listStatuses');
            },
            changeStatus: function() {
                console.log('ok');
            }
        },
        sockets:{
            listStatusesSuccess: function(statuses) {
                console.log(statuses);
                vmStatuses.$data.statuses = statuses;
            },
            listStatusesFailed: function(error) {
                console.log(error);
                console.log('could not load list of statuses: ' + error );
            }
        }
    });

    /*****************************************************************************************/
    /********************************* Users Vue Manager ***********************************/
    var vmUsers = new Vue({
        el: '#users',
        data: {
            users: []
        },
        mounted : function() {
            this.fetch();
        },
        methods:
        {
            fetch: function() {

            },
            changeStatus: function() {
                console.log('ok');
            }
        },
        sockets:{
            listUsersSuccess: function(users) {
                user = _.find(vmUsers.$data.users, user => user.project === users.project);
                if (typeof user === "undefined") {
                    vmUsers.$data.users.push(users);
                }
            },
            listUsersFailed: function() {

            }
        }
    });

});
