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
var tick = false;

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
        
        joinRoom();
 
        socket.on("playerAdd",function(resp){

            player1 = resp.players[0].id.substring(2);

            users[0] = player1;

            if(resp.players[1]) {

                player2 = resp.players[1].id.substring(2);

                users[1] = player2;
            }

            if(users.length===2){
                
                tick = true;
            }
            
            render(users);
                
        });

        var render = tick===true ? function(){$interval(function(){ drawEverything()},frameRate)} : function(){console.log(users)};
        
        

        socket.on("scoreTrack",function(resp){
            
            player1Score = resp.player1Score;
            player2Score = resp.player2Score;
            
            handleScore(player1Score,player2Score);
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

    

    function drawEverything() {
        
        drawBackground(canvas,ctx,canvasWidth,canvasHeight,'#000');

        drawPaddle1(ctx,0,paddle1Y,'#fff',paddleWidth,paddleHeight);
        // drawPaddle2(ctx,canvasWidth-paddleWidth,paddle2Y,'#fff',paddleWidth,paddleHeight);

        drawScores(ctx,player1Score,player2Score,canvasWidth);

        drawBall(ctx,ballX,ballY,ballSize);

        moveBall();         
    }

    

    
    function calculateMousePos(evt) {
        return evt.clientY;  
    }
    
    canvas.addEventListener('mousemove',function(event){
            var tempPos;
            var tempPos = paddle1Y;
            var tempPos2 = paddle2Y;

            if(socket.id===player1) {
              
                var mousePos = calculateMousePos(event);

                tempPos = mousePos - (paddleHeight/2); 
        
                if(tempPos <= 0) {

                    tempPos=0;
                } 
                else if(tempPos + paddleHeight >= canvasHeight) {

                    tempPos = canvasHeight - paddleHeight;
                }  

                movePaddle(tempPos,'player1')
                

            }
            else if(socket.id===player2) {
                
                if(socket.id===player2) {
                    var mousePos = calculateMousePos(event);

                    tempPos2 = mousePos - (paddleHeight/2); 
                
                if(tempPos2 <= 0) {

                    tempPos2=0;
                } 
                else if(tempPos2 + paddleHeight >= canvasHeight) {

                    tempPos2 = canvasHeight - paddleHeight;
                }

                }

                movePaddle(tempPos2,'player2')
                
            }
            
    });

    function movePaddle (paddle,player) {
        socket.emit("moveY",{
                    position: paddle,
                    player:player
        });   
    }

    function resetGame(str){
        var tempScore = player1Score;
        var tempScore2 = player2Score;

        relayBallPosition(centerX,centerY)
        
        if(str==='goLeft') {
           
            tempScore+=1;

            relayScore(tempScore,tempScore2)

            relayBallSpeedX(-originalSpeedX);
            relayBallSpeedY(-originalSpeedY);

        }
        else {

            tempScore2+=1;

            relayScore(tempScore,tempScore2);


            relayBallSpeedX(originalSpeedX);
            relayBallSpeedY(originalSpeedY);

        }

        

    }

    function joinRoom() {
        socket.emit("joinRoom",{
            room:room
        });
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
                $interval.cancel(render);
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

        relayBallPosition(ballX,ballY);

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
        var tempBallSpeedX = ballSpeedX;

        if(ballX < 0 + paddleWidth) {

            if(ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
                
                
                tempBallSpeedX = -tempBallSpeedX;

                relayBallSpeedX(tempBallSpeedX);

                variableSpeed(paddle1Y);

            }
            else {
                if(ballX < 0) {
                    resetGame('goRight');
                }
                
            }
        }

        else if(ballX > canvasWidth -paddleWidth) {

            if(ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
                
                tempBallSpeedX = -tempBallSpeedX;

                relayBallSpeedX(tempBallSpeedX);

                variableSpeed(paddle2Y);
            }
            else {
                if(ballX > canvasWidth){
                    resetGame('goLeft');
                }
                
            }
        }
       
    }

    function variableSpeed(paddle) {
        var tempBallSpeedY;

        var deltaY = ballY - (paddle +paddleHeight/2);

        tempBallSpeedY = Math.floor(deltaY * speedConst);  

        

        relayBallSpeedY(tempBallSpeedY); 
        
    }

    function handleVertical() {
        var tempBallSpeedY;

        if(ballY > canvasHeight) {

            tempBallSpeedY = -ballSpeedY;

            relayBallSpeedY(tempBallSpeedY);

        }
        else if (ballY <=0) {

            tempBallSpeedY = -ballSpeedY;

            relayBallSpeedY(tempBallSpeedY);

        }
    }
    
}])