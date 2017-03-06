window.addEventListener('load', function () {
    var vmUsers = new Vue({
        el: '#users',
        data: {
            users: []
        },
        mounted : function() {
            this.fetch();
        },
        methods:
        {
            fetch: function() {
                this.$sockt.emit('getTrackedUsers');
            }
        },
        sockets:{

        }
    });

});
