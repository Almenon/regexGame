module.exports = function (io) {
    var app = require('express');
    var router = app.Router();
    var regex = require('./regex');
    var freeRooms = [];

    io.on('connection', function (socket) {
        console.log('new connection' + socket.id);

        socket.on('disconnect', function () {
            console.log('disconnect' + socket.id);
            socket.broadcast.to(socket.room).emit('disconnected', '');
        });

        socket.on('joinRoom', function (room) {
            //eventually we will allow choosing of rooms
            // but for now rooms are assigned
            if (freeRooms.length > 0) {
                id = freeRooms.shift();
                socket.join(id)
                challenge = regex.randomChallenge()
                roomSockets = io.sockets.in(id).sockets;
                for (socketID in roomSockets) {
                    roomSockets[socketID].challengeId = challenge.id;
                };
                io.in(id).emit('connected', challenge);
            }
            else {
                id = 'r' + socket.id;
                socket.join(id); // you cannot have roomname same as id
                freeRooms.push(id);
            }
            socket.room = id;
            console.log('socket' + socket.id + 'joined room ' + id);
        });

        socket.on('message', function (re) {
            var challengeId = socket.challengeId;
            var matches = regex.applyRegex(re, challengeId)
            if (regex.iswin(matches, challengeId)) {
                console.log(socket.room + ' won')
                socket.broadcast.to(socket.room).emit('loss', '');
                socket.emit('won', '')
                socket.disconnect();
            }
            // socket.id is default room
            socket.broadcast.to(socket.room).emit('message', re);
        });

    });

    return router;
}
