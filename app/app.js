import angular from 'angular';
import uiRouter from 'angular-ui-router';
var randomstring = require('just.randomstring');

import {drawPaddle1,drawPaddle2,drawBackground,drawBall,drawScores} from './util/drawShapes.js';

import * as variable from './util/constants.js';

// https://stormy-stream-15316.herokuapp.com
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

var player1;
var player2;


var myApp = angular.module('myApp',['ui.router']);

myApp.config(['$stateProvider', '$urlRouterProvider','$locationProvider',function($stateProvider, $urlRouterProvider,$locationProvider){
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
}]);

myApp.controller('main',['$scope',function($scope){
    
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

}]);

myApp.controller('game',['$scope','$window','$interval','$location',function($scope,$window,$interval,$location){
    var socket = io();
    var users = [];
    
    

    socket.on('connect',function(){
        
        socket.emit("joinRoom",{
            room:room
        });

        socket.on("playerAdd",function(resp){
            
            player1 = resp.players[0].id.substring(2);
            users.push(player1);

            if(resp.players[1]) {
                player2 = resp.players[1].id.substring(2);
                users.push(player2)
            }
                
        });

        socket.on("scoreTrack",function(resp){
                
            player1Score = resp.player1Score;
            player2Score = resp.player2Score;

        });

        socket.on("paddleMove",function(resp){
            
            if(resp.player==="player1") {
                    
                paddle1Y = resp.position;
            }
            
            else if(resp.player==="player2"){
                   
                paddle2Y = resp.position; 
                   
            }
                
        });

        socket.on("ballPosition",function(resp){   
            
            ballX = resp.ballX;
            ballY = resp.ballY;

        });

        socket.on("ballSpeedTrackX",function(resp){
            
            ballSpeedX = resp.ballSpeedX;

        });

        socket.on("ballSpeedTrackY",function(resp){
            
            ballSpeedY = resp.ballSpeedY;

        });

    });

    
    var room = $location.search()['channel'];

    var canvas = document.getElementById("pong");
    var ctx = canvas.getContext("2d");

    var render = $interval(function(){ drawEverything() },frameRate);

    $window.addEventListener('resize', drawEverything, false); 

    $scope.load = function() {
        render
    }

    


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



    

    canvas.addEventListener('mousemove',function(event){
            var tempPos;

            if(socket.id===player1) {
              
                var mousePos = calculateMousePos(event);

                paddle1Y = mousePos - (paddleHeight/2); 
        
                if(paddle1Y <= 0) {

                    paddle1Y=0;
                } 
                else if(paddle1Y + paddleHeight >= canvasHeight) {

                    paddle1Y = canvasHeight - paddleHeight;
                }  

                socket.emit("moveY",{
                    position: paddle1Y,
                    player:"player1"
                });

            }
            else if(socket.id===player2) {
                
                if(socket.id===player2) {
                    var mousePos = calculateMousePos(event);

                    paddle2Y = mousePos - (paddleHeight/2); 
                
                if(paddle2Y <= 0) {

                    paddle2Y=0;
                } 
                else if(paddle2Y + paddleHeight >= canvasHeight) {

                    paddle2Y = canvasHeight - paddleHeight;
                }

                }
                socket.emit("moveY",{
                position: paddle2Y,
                player:"player2"
                });
            }
            
    });

    function resetGame(str){

        

        relayBallPosition(centerX,centerY)
        

        if(str==='goLeft') {
           
            player1Score+=1;

            relayScore(player1Score,player2Score)

            

            relayBallSpeedX(-originalSpeedX);
            relayBallSpeedY(-originalSpeedY);
        }
        else {
            player2Score+=1;

            relayScore(player1Score,player2Score)


            relayBallSpeedX(originalSpeedX);
            relayBallSpeedY(originalSpeedY);
        }

        

        

        handleScore(player1Score,player2Score)
        
        
    }

    function relayScore(p1,p2){
        socket.emit("score",{
            player1Score:p1,
            player2Score:p2
        });
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
        

        relayBallPosition(ballX += ballSpeedX,ballY += ballSpeedY);



        handleHorizontal();
        handleVertical();
                
    }

    function relayBallPosition(x,y) {
        socket.emit("ballMove",{
            ballX:x,
            ballY:y
        });
        
    }

    function relayBallSpeedX(x) {
        socket.emit("ballSpeedX",{
            ballSpeedX:x
        })
    }

    function relayBallSpeedY(y) {
        socket.emit("ballSpeedY",{
            ballSpeedY:y
        })
    }


    function handleHorizontal() {
        if(ballX < 0 + paddleWidth) {
            if(ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
                
                ballSpeedX = -ballSpeedX;

                relayBallSpeedX(ballSpeedX);

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

                relayBallSpeedX(ballSpeedX);

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

        relayBallSpeedY(ballSpeedY) 
        
    }

    function handleVertical() {
        if(ballY > canvasHeight) {

            ballSpeedY = -ballSpeedY;

            relayBallSpeedY(ballSpeedY)

        }
        else if (ballY <=0) {

            ballSpeedY = -ballSpeedY;

            relayBallSpeedY(ballSpeedY)

        }
    }
    
}])