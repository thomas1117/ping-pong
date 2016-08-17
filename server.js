var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + "/app"));

http.listen(app.get('port'), '0.0.0.0', function() {
  console.log('Server running on localhost:'+app.get('port'));
});

var clientInfo = {};
var users = [];

io.on('connection', function(socket){
	
  socket.on('disconnect',function(){
  	handleDisconnect(socket)
  });

  socket.on('moveY',function(req){
    sendPlayerData(req);
  });

  socket.on("score",function(req){
    trackScore(req);
  });

  socket.on("ballMove",function(req){
    trackBallPosition(req);
  });

  socket.on("ballSpeedX",function(req){
    trackBallSpeedX(req);  
  });

  socket.on("ballSpeedY",function(req){
    trackBallSpeedY(req); 
  });

  socket.on("username",function(req){
    clientInfo['username'] = req.username;
  });

  socket.on("joinRoom",function(req){
    clientInfo['id'] = socket.id;
    clientInfo['room'] = req.room;

    users.push(clientInfo);

    console.log(users)

    playerAdd(req);
  });

});

function handleDisconnect(socket) {
  var userData = clientInfo[socket.id];
      
  if(typeof socket.id !=='undefined') {
    socket.leave(socket.room);

    users = users.filter(function(obj){
      
      if(obj.id !== clientInfo.id) {
        return true;
      }

    });
  
  clientInfo = {};



  }
  return;
}

function playerAdd(req) {
  io.sockets.emit("playerAdd",{
      players:users
  });
}
function sendPlayerData(req) {
  
  io.sockets.emit('paddleMove',{
    player:req.player,
    position:req.position
  })
};

function trackScore(req) {
  io.sockets.emit("scoreTrack",{
    player1Score:req.player1Score,
    player2Score:req.player2Score
  });
};

function trackBallPosition(req) {
  io.sockets.emit("ballPosition",{
          ballX:req.ballX,
          ballY:req.ballY
  });
}

function trackBallSpeedX(req) {
  io.sockets.emit("ballSpeedTrackX",{
        ballSpeedX:req.ballSpeedX
  });
}

function trackBallSpeedY(req) {
  io.sockets.emit("ballSpeedTrackY",{
        ballSpeedY:req.ballSpeedY
  });
}

app.get('*',function(req,res){
	res.sendFile(__dirname + '/public/index.html');
});
