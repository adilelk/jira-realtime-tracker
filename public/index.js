module.exports.serve = function(app, express) {
  app.use(express.static(__dirname));
}
