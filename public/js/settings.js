//var socket = io.connect('http://localhost:3000');
Vue.use(VueSocketio, 'http://localhost:3000');
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



    /*var vmProjects = new Vue({
        el: '#projects',
        data: {
            projects: [],
            selectedProjects: []
        },
        mounted : function() {
            this.fetch();
        },
        methods:
        {
            fetch: function() {
                this.$socket.emit('listProjects')
            }
        },
        watch: {
            selectedProjects: function (val) {
                this.$socket.emit('saveProjects', val);
                vmUsers.$data.show = vmStatuses.$data.show = (val.length > 0);
                vmStatuses.$data.projectsStatuses = [];
                vmUsers.$data.projects = [];
                for (var i=0; i<val.length;i++) {
                    vmStatuses.loadStatuses(val[i]);
                    vmUsers.listUsers(val[i]);
                }
            }
        },
        sockets:{
            listProjectsSuccess: function(projects) {
              vmProjects.$data.projects = projects.all;
              if (typeof projects.selected !== 'undefined') {
                  projects.selected.forEach(function(selected) {
                      vmProjects.$data.selectedProjects.push(selected.name);
                  });
              }
            },
            listProjectsFailed: function(projects){
                console.log('could not load list of projects: ' + projects);
            }
        }
    });

    var vmStatuses = new Vue({
          el: '#statuses',
          data: {
              show: false,
              projectsStatuses: [],
              selectedStatus: []
          },
          watch: {
              selectedStatus: function (val) {
                  this.$socket.emit('saveStatuses', val);
              }
          },
          methods: {
              loadStatuses: function(project) {
                  this.$socket.emit('listStatuses', project);
              },
              getValue: function(statusName, projectId) {
                  return {projectName: projectId, statusName: statusName};
              }
          },
          sockets:{
              listStatusesSuccess: function(statuses) {
                  console.log(statuses);
                  if (typeof statuses.selected !== 'undefined') {
                      statuses.selected.forEach(function(selected) {
                          vmStatuses.$data.selectedStatus.push(selected.name);
                      });
                  }
                  vmStatuses.$data.projectsStatuses.push(statuses);
              },
              listStatusesFailed: function(data) {
                 console.log(data);
              },
              saveStatusesFailed: function(data) {
                 console.log(data);
              }
          }
    });

    var vmUsers = new Vue({
          el: '#users',
          data: {
              show: false,
              projects: [],
              selectedUsers: []
          },
          watch: {
              selectedUsers: function (val) {
                  console.log(val);
              }
          },
          methods: {
              listUsers: function(project) {
                  this.$socket.emit('listUsers', project);
              },
              getValue: function(userId, projectId) {
                  return {project: projectId, user: userId};
              }
          },
          sockets:{
              listUsersSuccess: function(data){
                 vmUsers.$data.projects.push(data);
             },
             listUsersFailed: function(data){
                vmUsers.$data.projects.push(data);
             }
          }
    });

    var workingHours = new Vue({
          el: '#workingHours',
          data: {
              show: true,
              hours: 8
          }
    });*/
});
