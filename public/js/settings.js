//var socket = io.connect('http://localhost:3000');
Vue.use(VueSocketio, 'http://localhost:3000');
window.addEventListener('load', function () {

    var vmProjects = new Vue({
        el: '#projects',
        data: {
            projects: [],
            selectedProjects: []
        },
        mounted : function()
        {
            this.fetch();
        },
        methods:
        {
            fetch: function()
            {
                this.$socket.emit('listProjects')
            }
        },
        watch: {
            selectedProjects: function (val) {
                vmUsers.$data.show = vmStatuses.$data.show = (val.length > 0);
                for (var i=0; i<vmStatuses.$data.projects.length;i++) {
                    if (val.indexOf(vmStatuses.$data.projects[i].project) < 0) {
                        vmStatuses.$data.projects.splice(i, 1);
                        vmUsers.$data.projects.splice(i, 1);
                    }
                }
                for (var i=0; i<val.length;i++) {
                    var project = _.find(vmStatuses.$data.projects, function(obj) { return obj.project == val[i] });
                    if (typeof project === "undefined") {
                        vmStatuses.loadStatuses(val[i]);
                        vmUsers.listUsers(val[i]);
                    }
                }
            }
        },
        sockets:{
            listProjectsSuccess: function(projects){
              vmProjects.$data.projects = projects;
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
              projects: [],
              selectedStatus: []
          },
          watch: {
              selectedStatus: function (val) {
                  console.log(val);
              }
          },
          methods: {
              loadStatuses: function(project) {
                  this.$socket.emit('listStatuses', project);
              },
              getValue: function(statusId, projectId) {
                  return statusId + '_' + projectId;
              }
          },
          sockets:{
              listStatusesSuccess: function(data) {
                  vmStatuses.$data.projects.push(data);
              },
              listStatusesFailed: function(data) {
                  vmStatuses.$data.projects.push(data);
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
                  return userId + '_' + projectId;
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
    });


    var actions = new Vue({
          el: '#actions',
          methods: {
              save: function() {
                  var settings = {
                      projects: vmProjects.$data.selectedProjects,
                      statuses: vmStatuses.$data.selectedStatus,
                      hours: workingHours.$data.hours
                  }
                  this.$socket.emit('saveSettings', settings);
              }
          },
          sockets:{
              settingsSaved: function(data){

              }
          }
    });


});
