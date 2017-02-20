
module.exports = function(config) {

    this.name = 'jira';

    var Client = require('node-rest-client').Client;

    var options_auth = {
        user: config.jira.username,
        password: config.jira.password
    };

    var client = new Client(options_auth);

    this.makeUrl = function(action) {
        return config.jira.url + action;
    };

    this.listProjects = function(callbackSuccess, callbackError) {
        var url = this.makeUrl(config.jira.actionsUrls.listProjects);
        client.get(url, function (data, response) {
            if(response.statusCode == '200') {
                callbackSuccess(data);
            } else {
                callbackError(response.statusCode + ' ' + response.statusMessage)
            }
        });
    };

    this.listStatuses = function(callbackSuccess, callbackError) {
        var url = this.makeUrl(config.jira.actionsUrls.listStatuses);
        client.get(url, function (data, response) {
            if(response.statusCode == '200') {
                callbackSuccess(data);
            } else {
                callbackError(
                    'Could not list statuses for project '
                    + project
                    + '. Error is :'
                    + response.statusCode
                    + ' '
                    + response.statusMessage
                );
            }
        });
    };

    this.listUsers = function(project, callbackSuccess, callbackError) {
        var url = this.makeUrl(config.jira.actionsUrls.listUsers.replace(':project', project));
        client.get(url, function (data, response) {
            if(response.statusCode == '200') {
                callbackSuccess(data);
            } else {
                callbackError(
                    'Could not list statuses for project '
                    + project
                    + '. Error is :'
                    + response.statusCode
                    + ' '
                    + response.statusMessage
                );
            }
        });
    };
};
