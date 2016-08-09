// up 38  40

(function() {
	window.onload = function() {
		resizeCanvas();
		startGame();
		drawEverything();
	}

	var masterWidth = window.innerWidth;
	var masterHeight = window.innerHeight;
	var paddleWidth = window.innerWidth/40;
	var paddleHeight = window.innerHeight/5;

	var yLocation = (masterHeight - paddleHeight)/2

	var canvas = document.getElementById("pong");
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000";
	ctx.fillRect(0,0,masterWidth,masterHeight);


	window.addEventListener('resize', resizeCanvas, false);

	window.addEventListener('keydown',function(e){
	
		switch(e.keyCode) {
			case 38: 
				e.preventDefault();

				yLocation = yLocation - 40;

				

				if(yLocation<0) {

					yLocation = 0;

				}
				break;

			case 40: 
				e.preventDefault();
				yLocation = yLocation + 40;

				if(yLocation>masterHeight-paddleHeight) {

					yLocation = masterHeight-paddleHeight;
				}
					
				
				drawPaddle(0,yLocation);
				break;
			
			default:
			break;
		}
	})
	
    function resizeCanvas() {
       drawBackground();
       drawPaddle();     
    }

    function drawEverything() {
    	setInterval(function(){
    		drawBackground();
    		drawPaddle(0,yLocation)
       		
    	},20)
    	
    }

    function drawBackground() {
    	canvas.width = masterWidth;
        canvas.height = masterHeight;
        ctx.fillStyle = "#000";
		ctx.fillRect(0,0,masterWidth,masterHeight);
    }

    function startGame() {
    	drawPaddle(0,yLocation)
    }


    function drawPaddle(x,y) {
    
    	ctx.fillStyle = "#fff";
		ctx.fillRect(x,y,paddleWidth,paddleHeight)
    }
	
})();

