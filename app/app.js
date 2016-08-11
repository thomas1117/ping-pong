import angular from 'angular';
import uiRouter from 'angular-ui-router';

import {drawPaddle1,drawPaddle2,drawBackground,drawBall} from './util/drawShapes.js';

import * as variable from './util/constants.js';

var {canvasWidth,canvasHeight,paddleWidth,paddleHeight,paddle1Y,paddle2Y,ballSize,
    ballSpeedX,ballSpeedY,originalSpeedX,originalSpeedY,ballX,ballY,speedConst,player1Score,
    player2Score,maxScore,frameRate} = variable;


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

    $window.addEventListener('resize', resizeCanvas, false); 
    $scope.load = function() {render}
    
    var render = $interval(function(){ drawEverything() },frameRate);


    function drawEverything() {
        
        drawBackground(canvas,ctx,canvasWidth,canvasHeight,'#000');
        drawPaddle1(ctx,0,paddle1Y,'#fff',paddleWidth,paddleHeight);
        drawPaddle2(ctx,canvasWidth-paddleWidth,paddle2Y,'#fff',paddleWidth,paddleHeight);
        ctx.font = '2rem arial';
        ctx.fillText(player1Score,canvasWidth/4,40);    
        ctx.fillText(player2Score,canvasWidth-canvasWidth/4,40); 
        drawBall(ctx,ballX,ballY,ballSize);
        moveBall();         
}

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

    
       
    
    function resetGame(str){
        ballX = canvasWidth/2;
        ballY = canvasHeight/2;
        

        if(str==='goLeft') {
            
            player1Score+=10;

            ballSpeedX = -originalSpeedX;
            ballSpeedY = -originalSpeedY;
        }
        else {
            player2Score+=10;

            ballSpeedX = originalSpeedX;
            ballSpeedY = originalSpeedY;
        }

        handleScore(player1Score,player2Score)
        
        
    }

    function handleScore(p1,p2) {
       
        if(p1 === maxScore || p2 === maxScore) {
            $interval(function(){
                $interval.cancel(render)
            },frameRate);

            gameEnd();
            
        }
        
    }

    function gameEnd() {
        console.log('game ended')
    }



    function moveBall() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        handleHorizontal();
        handleVertical();
                
    }


    function handleHorizontal() {
        if(ballX < 0 + paddleWidth) {
            if(ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
                
                ballSpeedX = -ballSpeedX;
                variableSpeed(paddle1Y)

            }
            else {
                if(ballX < 0) {
                    resetGame('goRight')
                }
                
            }
        }

        else if(ballX > canvasWidth -paddleWidth) {

            if(ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
                
                ballSpeedX = -ballSpeedX;
                variableSpeed(paddle2Y)
            }
            else {
                if(ballX > canvasWidth){
                    resetGame('goLeft')
                }
                
            }
        }
       
    }

    function variableSpeed(paddle) {

        var deltaY = ballY - (paddle +paddleHeight/2);

        ballSpeedY = deltaY * speedConst;   
        
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