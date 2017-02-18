module.exports = function(database) {

    this.id = null;
    this.projectName = null;
    this.projectId = null;
    this.tracker = null;

    this.getTableName = function() {
        return 'projects';
    }

    this.init = function() {
        this.id = null;
        this.name = null;
    }

    this.get = function(fields, condition, success, error)
    {
        database.select(fields).from(this.getTableName()).where(condition).execute(success, error);
    }

    this.getAll = function(success, error) {
        database.select(['*']).from(this.getTableName()).execute(success, error);
    }

    this.delete = function(condition, success, error) {
        database.delete().from(this.getTableName()).where(condition).execute(success, error);
    }

    this.save = function(success, error)
    {
        if (this.id === null) {
            database.insert(this.getTableName(), {id: null, project_name: this.projectName, project_id: this.projectId, tracker: this.tracker}).execute(success, error);
        } else {
            database.update(this.getTableName(), {id: this.id, project_name: this.projectName, project_id: this.ptojectId, tracker: this.tracker}).execute(success, error);
        }

    }
}
