function drawBackground(canvas,ctx,width,height,color) {
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = color;
    ctx.fillRect(0,0,width,height);
}



function drawPaddle1(ctx,x,y,color,width,height) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,width,height)
}

function drawPaddle2(ctx,x,y,color,width,height) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,width,height)
}

function drawBall(ctx,x,y,size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI*2);
    ctx.fill();
}

function drawScores(ctx,p1,p2,canvasWidth){
    ctx.font = '2rem arial';
    ctx.fillText(p1,canvasWidth/4,40);    
    ctx.fillText(p2,canvasWidth-canvasWidth/4,40); 
}


export  {
    drawBackground,
    drawPaddle1,
    drawPaddle2,
    drawBall,
    drawScores
}

