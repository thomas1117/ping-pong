var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + "/app"));

http.listen(app.get('port'), function() {
  console.log('Server running on localhost:'+app.get('port'));
});

io.on('connection', function(socket){
  	
  	socket.on('moveY',function(req){
  		sendPlayerData(req);


	});
})


app.get('/',function(req,res){
	res.sendFile(__dirname + '/public/index.html')
})

function sendPlayerData(req) {
	
	io.sockets.emit('player1Move',{
		position:req.position
	})
};