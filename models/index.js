module.exports = function(database) {

    this.get = function(modelName) {

        var model = new (require('./' + database.provider + '/' + modelName))(database);
        if (typeof model == "undefined") {
            throw new Error('Model ' + modelName + ' not found');
        }

        return model;
    };
}
