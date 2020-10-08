
var canvas;
var ctx;
var canvasEdgeSize = 500;

function drawFractal(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    draw(7);
}

function draw(currentStep) {

    if (currentStep == 1) {
        drawBaseShape();
    } else {
        ctx.save();
        transformF1();
        draw(currentStep - 1)
        ctx.restore();
    
        ctx.save();
        transformF2();
        draw(currentStep - 1);
        ctx.restore();
    
        ctx.save();
        transformF3();
        draw(currentStep - 1);
        ctx.restore();

        ctx.save();
        transformF4();
        draw(currentStep - 1);
        ctx.restore();
    }

}

function transformF1(){
	ctx.transform(0.5, 0, 0, 0.5, canvasEdgeSize / 2, 0);
}

function transformF2(){
	ctx.transform(-0.5, 0, 0, 0.5, canvasEdgeSize, canvasEdgeSize / 2);
}

function transformF3(){
	ctx.transform(-0.5, 0, 0, -0.5, canvasEdgeSize / 2, canvasEdgeSize);
}

function transformF4(){
	ctx.transform(0, 0.25, 0.25, 0, canvasEdgeSize / 4, canvasEdgeSize / 4);
}

function drawBaseShape(){
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvasEdgeSize);
    ctx.lineTo(canvasEdgeSize, canvasEdgeSize);
    ctx.lineTo(canvasEdgeSize, 400);
    ctx.lineTo(250, 400);
    ctx.lineTo(250, 0);
    ctx.fill();  
}

drawFractal();