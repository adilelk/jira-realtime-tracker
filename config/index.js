module.exports = {
    //database selected:
    database: 'mysql',
    //tracker selected
    activeTracker: "jira",

    //list of databases configuration
    mysql: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        database: 'tracker'
    },
    neo4j: {

    },

    //list of trackers configuration
    jira: {
        actionsUrls: {
            listProjects : '/project',
            listStatuses : '/status',
            listUsers    : '/user/assignable/search?project=:project'
        }
    }
};
