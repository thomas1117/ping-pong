require('angular');
require('angular-ui-router');

var myApp = angular.module('myApp',['ui.router']);

myApp.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/landing');
    
    $stateProvider
        
        .state('landing', {
            url: '/landing',
            templateUrl: './components/landing.html',
            controller: 'main'
        })
        
        
        .state('game', {
        	url: '/game',
            templateUrl: '../components/game.html',
            controller: 'game'
                  
        });
});

myApp.controller('main',function($scope){
    
    console.log($scope)    

});

myApp.controller('game',function($scope,$window,$interval){
    $scope.load = function() {drawEverything()}
    $window.addEventListener('resize', resizeCanvas, false); 
    var canvasWidth = $window.innerWidth;
    var canvasHeight = $window.innerHeight;
    // var paddleWidth = $window.innerWidth/40;
    // var paddleHeight = $window.innerHeight/5;
    var paddleWidth = $window.innerWidth/40;
    var paddleHeight = 200;
    
    var paddle1Y = (canvasHeight - paddleHeight)/2
    var paddle2Y = 10 || (canvasHeight - paddleHeight)/2;

    var ballSize = 12;
    var ballSpeedX = 6;
    var ballSpeedY = 10;
    var ballX = canvasWidth/2;
    var ballY = canvasHeight/2;


    var canvas = document.getElementById("pong");
    var ctx = canvas.getContext("2d");
  

    function calculateMousePos(evt) {
        return evt.clientY;
       
    }

    canvas.addEventListener('mousemove',
        function(event){
            
            var mousePos = calculateMousePos(event);

            paddle1Y = mousePos - (paddleHeight/2); 
        
            if(paddle1Y <= 0) {
                paddle1Y=0;
            } 
            else if(paddle1Y + paddleHeight >= canvasHeight) {
                paddle1Y = canvasHeight - paddleHeight;
            }  
        })

    
    function resizeCanvas() {
       drawEverything();     
    }

    function drawEverything() {
        $interval(function(){

            drawBackground(canvasWidth,canvasHeight,'#000');

            drawPaddle1(0,paddle1Y,'#fff',paddleWidth,paddleHeight);

            drawPaddle2(canvasWidth-paddleWidth,paddle2Y,'#fff',paddleWidth,paddleHeight);

            drawBall();
            moveBall();
            
        },20)
        
    }

    function drawBackground(width,height,color) {

        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = color;
        ctx.fillRect(0,0,width,height);
    }

    function drawPaddle1(x,y,color,width,height) {
        ctx.fillStyle = color;
        ctx.fillRect(x,y,width,height)
    }

    function drawPaddle2(x,y,color,width,height) {
        ctx.fillStyle = color;
        ctx.fillRect(x,y,width,height)
    }

    function startGame() {
        drawPaddle1(0,paddle1Y)
    }

    function restartGame(str){
        ballX = canvasWidth/2;
        ballY = canvasHeight/2;
        

        if(str==='goLeft') {
           //do nothing
          
            ballSpeedX = -6;
            ballSpeedY = -10;
        }
        else {
            ballSpeedX = 6;
            ballSpeedY = 10;
        }
        
        
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballSize, 0, Math.PI*2);
        ctx.fill();
    }

    function moveBall() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        handleHorizontal();
        handleVertical();
                
    }

    // bundle.js:207 middle 787
    // bundle.js:208 ballY 599
    // bundle.js:210 delta 188
    // bundle.js:207 middle 787
    // bundle.js:208 ballY 519
    // bundle.js:210 delta 268

    // 787-599  186

    function handleHorizontal() {
        if(ballX < 0 + paddleWidth) {
            if(ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
                
                variableSpeed(paddle1Y)

            }
            else {
                restartGame('goRight')
            }
        }

        else if(ballX > canvasWidth -paddleWidth) {

            if(ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
                
                variableSpeed(paddle2Y)
            }
            else {
                restartGame('goLeft')
            }
        }
       
    }

    function variableSpeed(paddle) {
        var top = paddle;
        var bottom = paddle + paddleHeight;


        //top 20
        //middle 50
        //bottom 80
        

        //bally 20  //50-20 30
        //paddleheight 200-
        var middle = top+bottom/2;
        
        
        

        var delta = Math.abs(middle - ballY);
   
        ballSpeedX = delta * .01 * ballSpeedX;
                
        ballSpeedX = -ballSpeedX;
    }

    function handleVertical() {
        if(ballY > canvasHeight) {
            ballSpeedY = -ballSpeedY;
        }
        else if (ballY <=0) {
            ballSpeedY = -ballSpeedY;
        }
    }
    
})