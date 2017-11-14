var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile("index.html", { "root": __dirname });
});

var clients = 0;
io.on('connection', function (socket) {
    console.log('A user connected');

    //Send a message after a timeout of 4seconds
    setTimeout(function () {
        socket.send('Sent a message 4seconds after connection!');
    }, 4000);

    setTimeout(function () {
        //Sending an object when emmiting an event
        socket.emit('testerEvent', { description: 'A custom event named testerEvent!' });
    }, 5000);

    socket.on('clientEvent', function (data) {
        console.log(data);
    });


    clients++;
    io.sockets.emit('broadcast', { description: clients + ' clients connected!' });
    socket.on('disconnect', function () {
        clients--;
        io.sockets.emit('broadcast', { description: clients + ' clients connected!' });
        console.log('A user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});