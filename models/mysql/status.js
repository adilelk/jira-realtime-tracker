module.exports = function(database) {

    this.id = null;
    this.projectName = null;
    this.projectId = null;
    this.tracker = null;

    this.getTableName = function() {
        return 'statuses';
    }

    this.init = function() {
        this.id = null;
        this.name = null;
        this.project_id = null;
    }

    this.save = function(success, error) {
        if (this.id === null) {
            database.insert(this.getTableName(), {id:null, name: this.name, project_id: this.projectId}).execute(success, error);
        } else {
            database.update(this.getTableName(), {name:this.name, project_id: this.projectId}).where({id: this.id}).execute(success, error);
        }
    };

    this.delete = function() {

    };

    this.get = function(fields, success, error) {
        database.select(fields).from(this.getTableName()).join('projects', 'statuses.project_id = projects.id').execute(success, error);
    };

    this.deleteAll = function(success, error) {
        database.delete(this.getTableName()).execute(success, error);
    };
}
