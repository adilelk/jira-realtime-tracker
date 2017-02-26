module.exports = {

    database: 'mysql',
    //tracker selected
    activeTracker: "jira",
    //protocol to use:
    protocol: 'http',
    port: 3000,

    //list of databases configuration
    mysql: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'harukanaru',
        database: 'tracker'
    },
    neo4j: {

    },

    //list of trackers configuration
    jira: {
        url: "https://jira.arrowcloud.org/rest/api/2",
        username: "aek",
        password: "@rrowaek",
        actionsUrls: {
            listProjects : '/project',
            listStatuses : '/status',
            listUsers    : '/user/assignable/search?project=:project',
            search       : '/search?jql='
        }
    }
};
