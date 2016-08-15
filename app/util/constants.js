var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var centerX = canvasWidth/2;
var centerY = canvasHeight/2;

var paddleWidth = window.innerWidth/40;
var paddleHeight = window.innerHeight/5;

var paddle1Y = (canvasHeight - paddleHeight)/2
var paddle2Y = (canvasHeight - paddleHeight)/2;

var ballSize = 12;

var ballSpeedX = 8;
var ballSpeedY = 12;

var originalSpeedX = 8;
var originalSpeedY = 12;

var ballX = canvasWidth/2;
var ballY = canvasHeight/2;

var speedConst = .25;

var player1Score = 0;
var player2Score = 0;
var maxScore = 10;

var ticking = true;
var frameRate = 2;

module.exports = {
    centerX,
    centerY,
    canvasWidth,
    canvasHeight,
    paddleWidth,
    paddleHeight,
    paddle1Y,
    paddle2Y,
    ballSize,
    ballSpeedX,
    ballSpeedY,
    originalSpeedX,
    originalSpeedY,
    ballX,
    ballY,
    speedConst,
    player1Score,
    player2Score,
    maxScore,
    frameRate
}