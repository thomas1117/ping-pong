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
var index;

io.on('connection', function(socket){
  
  socket.on('disconnect',function(){
  	handleDisconnect(socket);
  });

  socket.on("joinRoom",function(req){
    handleJoin(req,socket);
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

});

function handleDisconnect(socket) {
  var userData = clientInfo[socket.id];
      
  if(typeof socket.id !=='undefined') {
    socket.leave(socket.room);

    users = users.filter(function(item,i){
      return i !== index;
    });

    console.log('at disconnect',users)

    clientInfo = {};

  }
 
}

function handleJoin(req,socket) {
  clientInfo['id'] = socket.id;
  clientInfo['room'] = req.room;

  if(users.length===0){
    users.push(clientInfo);
  }

  else {
    
    users.forEach(function(data){
      
      if(data.id === clientInfo.id){
        console.log('it equals')
      }

      else {
        users.push(clientInfo);
      }

    });
    console.log('users at handleJoin ',users)
  }

  index = users.length - 1;
    
  playerAdd(users);
}

function playerAdd(users) {

  console.log('here are users at player add',users);

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
