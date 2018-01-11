var UserHandler = require('./server.js');
var db = require('./database.js');
var USERS = {
	/* "Krum": 'Krum',
	 * "Bobby": 'Bobby'*/
};

function usersList(socket) {
	console.log('Broadcasting users list', Object.keys(USERS));
	socket.broadcast.emit('usersList', {users: Object.keys(USERS)});

	// NOTE explicitly send the users list to myself
	socket.emit('usersList', {users: Object.keys(USERS)});
}

module.exports = {
	registration: function(data /*username pass email gender*/) {
			console.log('Pravq registraciq !');
			var requiredFieldsOk = !!(data.nickname &&
                data.password &&
                data.email &&
                data.gender &&
                data.nickname);
			console.log('requiredFieldsOk: ', requiredFieldsOk);
			if (!requiredFieldsOk) {
				return false;
			} else {
				console.log('console logvam da widq metodite');
				console.log(db);
                console.log('console logvam da widq metodite');
                db.createUser(data);
                return true;
               
			}
        },
	socketHandlers: {
		login: function(socket, data /*{nick: 'Nickname'}*/) {
			if (data.nick && !USERS[data.nick]) {
				USERS[data.nick] = socket;
				socket.nickname = data.nick;
				socket.emit('loginSuccess', { nick: data.nick });

				console.log('Hello, ', data.nick);
				usersList(socket);
			}
		},
		logout: function(socket, data /*{}*/) {
			if (socket.nickname && USERS[socket.nickname]) {
				delete USERS[socket.nickname];
				delete socket.nickname;

				console.log('Goodbye', socket.nickname);
				usersList(socket);
			}
		},
		sendMessage: function(socket, data /*{to:"user", msg:"What's up"}*/) {
			if (data.to && USERS[data.to]) {
				USERS[data.to].emit('receiveMessage', { from: socket.nickname, msg: data.msg });
				console.log(socket.nickname, ' to ', data.to, ': ', data.msg);
			}
		},
		

		
	}
};
