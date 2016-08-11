import angular from 'angular';
import uiRouter from 'angular-ui-router';
var randomstring = require('just.randomstring');

import {drawPaddle1,drawPaddle2,drawBackground,drawBall,drawScores} from './util/drawShapes.js';

import * as variable from './util/constants.js';



var {centerX,centerY,
    canvasWidth,canvasHeight,
    paddleWidth,paddleHeight,
    paddle1Y,paddle2Y,
    ballSize,
    ballSpeedX,ballSpeedY,
    originalSpeedX,originalSpeedY,
    ballX,ballY,
    speedConst,
    player1Score,
    player2Score,
    maxScore,
    frameRate} = variable;


var myApp = angular.module('myApp',['ui.router']);

myApp.config(function($stateProvider, $urlRouterProvider,$locationProvider){
	$urlRouterProvider.otherwise('/landing');
    
    $stateProvider
        
        .state('landing', {
            url: '/landing',
            templateUrl: './components/landing.html',
            controller: 'main'
        })
         
        .state('game', {
        	url: '/game',
            templateUrl: './components/game.html',
            controller: 'game'
                  
        });
});

myApp.controller('main',function($scope){
    
    $scope.generateGame = function(user) {
        if($scope.channel) {
            return;
        }
        if($scope.user) {
            $scope.channel = randomstring(8);
            
        }
        else {
            $scope.validate = "You need a username!";
        }

          
    }

    $scope.navigate = function(user) {
        socket.emit("username",{
            username:user
        })
    }

});

myApp.controller('game',function($scope,$window,$interval,$location){


    var room = $location.search()['channel'];

    var canvas = document.getElementById("pong");
    var ctx = canvas.getContext("2d");

    var render = $interval(function(){ drawEverything() },frameRate);

    $window.addEventListener('resize', drawEverything, false); 

    $scope.load = function() {render}

    


    function drawEverything() {
        
        drawBackground(canvas,ctx,canvasWidth,canvasHeight,'#000');

        drawPaddle1(ctx,0,paddle1Y,'#fff',paddleWidth,paddleHeight);
        drawPaddle2(ctx,canvasWidth-paddleWidth,paddle2Y,'#fff',paddleWidth,paddleHeight);

        drawScores(ctx,player1Score,player2Score,canvasWidth);

        drawBall(ctx,ballX,ballY,ballSize);

        moveBall();         
    }

    

    
    function calculateMousePos(evt) {
        return evt.clientY;
       
    }



    socket.on('connect',function(){
        
        socket.emit("joinRoom",{
            room:room
        });

        socket.on("player1Move",function(resp){
            paddle2Y = resp.position;
        });

        socket.on("playerAdd",function(resp){
            console.log(resp)
        })

    });

    canvas.addEventListener('mousemove',function(event){

            //socket user check??

            /*if(user1){
                socket.emit("moveY",{position:paddle1Y})

            else {socket.emit("moveY",{position:paddle2Y})}

            }*/
            
            var mousePos = calculateMousePos(event);

            paddle1Y = mousePos - (paddleHeight/2); 
        
            if(paddle1Y <= 0) {

                paddle1Y=0;
            } 
            else if(paddle1Y + paddleHeight >= canvasHeight) {

                paddle1Y = canvasHeight - paddleHeight;
            }  

            socket.emit("moveY",{
                position: paddle1Y
            })
    });

    function resetGame(str){

        ballX = centerX;
        ballY = centerY;
        

        if(str==='goLeft') {
            
            player1Score+=1;
            

            ballSpeedX = -originalSpeedX;
            ballSpeedY = -originalSpeedY;
        }
        else {
            player2Score+=1;


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
        return;
        
    }

    function gameEnd() {
        drawText();
        
    }

    function drawText() {
        $interval(function(){
            ctx.font = '2rem arial';
            ctx.fillText("play again?",canvasWidth/2,canvasHeight/3);
        },frameRate)
        
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