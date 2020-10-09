var canvasEdgeSize = 500;
var stepCount = 7;

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
}

function drawFractal() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    draw(ctx, stepCount);
}

async function animateF1() {
    var canvas2 = document.getElementById('canvas2');
    var ctx2 = canvas2.getContext('2d');
    ctx2.fillStyle = '#99ccff';

    var xCoordinateStart = 0;
    for (var i = 0; i <= 1; i += 0.1) {
        await sleep(100);

        ctx2.clearRect(0, 0, canvasEdgeSize, canvasEdgeSize);
        ctx2.save();

        var vector = 1 - 0.5 * i;

        ctx2.transform(vector, 0, 0, vector, xCoordinateStart, 0);
        drawBaseShape(ctx2);
        ctx2.restore();

        var xCoordinateStart = xCoordinateStart + 25;
    }
}

async function animateF2() {
    var canvas2 = document.getElementById('canvas2');
    var ctx2 = canvas2.getContext('2d');
    ctx2.fillStyle = '#66ffcc';

    var xCoordinateStart = 0;
    var yCoordinateStart = 0;
    for (var i = 0; i <= 1; i += 0.1) {
        await sleep(100);

        ctx2.clearRect(0, 0, canvasEdgeSize, canvasEdgeSize);
        ctx2.save();

        var vector1 = 1 - 1.5 * i;
        var vector2 = 1 - 0.5 * i;

        ctx2.transform(vector1, 0, 0, vector2, xCoordinateStart, yCoordinateStart);
        drawBaseShape(ctx2);
        ctx2.restore();

        xCoordinateStart = xCoordinateStart + 50;
        yCoordinateStart = yCoordinateStart + 25;
    }
}

async function animateF3() {
    var canvas2 = document.getElementById('canvas2');
    var ctx2 = canvas2.getContext('2d');
    ctx2.fillStyle = '#ff3399';

    var xCoordinateStart = 0;
    var yCoordinateStart = 0;
    for (var i = 0; i <= 1; i += 0.1) {
        await sleep(100);

        ctx2.clearRect(0, 0, canvasEdgeSize, canvasEdgeSize);
        ctx2.save();

        var vector = 1 - 1.5 * i;

        ctx2.transform(vector, 0, 0, vector, xCoordinateStart, yCoordinateStart); 
        drawBaseShape(ctx2);
        ctx2.restore();

        xCoordinateStart = xCoordinateStart + 25;
        yCoordinateStart = yCoordinateStart + 50;
    }
}

async function animateF4() {
    var canvas2 = document.getElementById('canvas2');
    var ctx2 = canvas2.getContext('2d');
    ctx2.fillStyle = '#ff9900';

    var coordinateStart = 0;
    for (var i = 0; i <= 1; i += 0.1) {
        await sleep(100);

        ctx2.clearRect(0, 0, canvasEdgeSize, canvasEdgeSize);
        ctx2.save();

        var vector1 = 0.25 * i;
        var vector2 = 1 - i;

        ctx2.transform(vector2, vector1, vector1, vector2, coordinateStart, coordinateStart);
        drawBaseShape(ctx2);
        ctx2.restore();

        coordinateStart = coordinateStart + 12.5;
    }
}

function draw(ctx, currentStep) {
    if (currentStep == 1) {
        drawBaseShape(ctx);
    } else {
        ctx.save();
        if (currentStep == stepCount)
            ctx.fillStyle = '#99ccff';
        transformF1(ctx);
        draw(ctx, currentStep - 1);
        ctx.restore();
    
        ctx.save();
        if (currentStep == stepCount)
            ctx.fillStyle = '#66ffcc';
        transformF2(ctx);
        draw(ctx, currentStep - 1);
        ctx.restore();
    
        ctx.save();
        if (currentStep == stepCount)
            ctx.fillStyle = '#ff3399';
        transformF3(ctx);
        draw(ctx, currentStep - 1);
        ctx.restore();

        ctx.save();
        if (currentStep == stepCount)
            ctx.fillStyle = '#ff9900';
        transformF4(ctx);
        draw(ctx, currentStep - 1);
        ctx.restore();
    }
}

function transformF1(ctx) {
	ctx.transform(0.5, 0, 0, 0.5, canvasEdgeSize / 2, 0);
}

function transformF2(ctx) {
	ctx.transform(-0.5, 0, 0, 0.5, canvasEdgeSize, canvasEdgeSize / 2);
}

function transformF3(ctx) {
	ctx.transform(-0.5, 0, 0, -0.5, canvasEdgeSize / 2, canvasEdgeSize);
}

function transformF4(ctx) {
	ctx.transform(0, 0.25, 0.25, 0, canvasEdgeSize / 4, canvasEdgeSize / 4);
}

function drawBaseShape(ctx) {
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