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