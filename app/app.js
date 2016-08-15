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

