module.exports = function(socket, tracker, database) {
    socket.on('saveSettings', function(settings) {
        console.log(settings);
    });
}
