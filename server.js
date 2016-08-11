var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + "/app"));

http.listen(app.get('port'), function() {
  console.log('Server running on localhost:'+app.get('port'));
});

var clientInfo = {};
var users = [];

io.on('connection', function(socket){
  	socket.on('disconnect',function(){
  		var userData = clientInfo[socket.id];

  		if(typeof userData !=='undefined') {
  			socket.leave(userData.room);
  		}

  		clientInfo = {};

  	})
  	socket.on('moveY',function(req){
  		sendPlayerData(req);


	});

	socket.on("username",function(req){
		clientInfo['username'] = req.username;
	})

	socket.on("joinRoom",function(req){
		clientInfo[socket.id] = req;
		users.push(clientInfo);

		socket.broadcast.to(req.room).emit("playerAdd",{
			players:users
		})
	})
})


app.get('/',function(req,res){
	res.sendFile(__dirname + '/public/index.html')
})

function sendPlayerData(req) {
	
	io.sockets.emit('player1Move',{
		position:req.position
	})
};
