var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var chat = require('./chattt.js');

server.listen(8080);

var options = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['htm', 'html'],
	index: 'index.html',
	maxAge: '1d',
	redirect: false/*,
	setHeaders: function (res, path, stat) {
		res.set('x-timestamp', Date.now())
	}*/
}

app.use('/', express.static('./public', options));

io.on('connection', function (socket) {
	for (let k in chat.socketHandlers) {
		socket.on(k, function(data) {
			chat.socketHandlers[k](socket, data);
		});
	}
	socket.on('disconnect', function() {
		chat.socketHandlers.logout(socket, {});
	});

	socket.emit('hello', { app: 'ChatTT app here!' });
});

