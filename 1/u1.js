
var canvas;
var ctx;
var canvasEdgeSize = 500;
var stepCount = 7;

function drawFractal(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    draw(stepCount);
}

function draw(currentStep) {

    if (currentStep == 1) {
        drawBaseShape();
    } else {
        ctx.save();
        transformF1(currentStep);
        draw(currentStep - 1)
        ctx.restore();
    
        ctx.save();
        transformF2(currentStep);
        draw(currentStep - 1);
        ctx.restore();
    
        ctx.save();
        transformF3(currentStep);
        draw(currentStep - 1);
        ctx.restore();

        ctx.save();
        transformF4(currentStep);
        draw(currentStep - 1);
        ctx.restore();
    }

}

function transformF1(currentStep){
    if (currentStep == stepCount)
        ctx.fillStyle = '#99ccff';
	ctx.transform(0.5, 0, 0, 0.5, canvasEdgeSize / 2, 0);
}

function transformF2(currentStep){
    if (currentStep == stepCount)
        ctx.fillStyle = '#66ffcc';
	ctx.transform(-0.5, 0, 0, 0.5, canvasEdgeSize, canvasEdgeSize / 2);
}

function transformF3(currentStep){
    if (currentStep == stepCount)
        ctx.fillStyle = '#ff3399';
	ctx.transform(-0.5, 0, 0, -0.5, canvasEdgeSize / 2, canvasEdgeSize);
}

function transformF4(currentStep){
    if (currentStep == stepCount)
        ctx.fillStyle = '#ff9900';
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