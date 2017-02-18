module.exports = function() {
    this.load = function(config) {
        //loading the client that was activated in the configuration file
        try {
            var tracker = require('./'+config.activeTracker);
            return new tracker(config);
        } catch (ex) {
            throw new Exception('Tracker ' + config.activeTracker + ' not supported')
        }
    }
}
