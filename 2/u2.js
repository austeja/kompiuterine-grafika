function setupPlane(scene) {
    var groundPlaneGeometry = new THREE.PlaneGeometry(50, 50);
    var groundPlaneMaterial =    new THREE.MeshLambertMaterial({color: 0xffffff});
    var groundPlane = new THREE.Mesh(groundPlaneGeometry, groundPlaneMaterial);
    groundPlane.receiveShadow  = true;

    groundPlane.rotation.x = -0.5 * Math.PI;
    groundPlane.position.x = 15;
    groundPlane.position.y = 0;
    groundPlane.position.z = 0;

    scene.add(groundPlane);
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function createRenderer() {
    var renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(0xFFFFFF, 1.0); // background color
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    return renderer;
}

function clearScene(scene) {
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
}

function redraw(scene, stepCount, stepRotationInDegrees) {
    clearScene(scene);
    draw(scene, stepCount, stepRotationInDegrees);
}

function setupLight(scene) {
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set( -40, 60, -10 );
    spotLight.castShadow = true;
    scene.add( spotLight );

    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
}

function createHelperAxis(scene) {
    // The X axis is red. The Y axis is green. The Z axis is blue.
    const axesHelper = new THREE.AxesHelper(20);
    scene.add( axesHelper );
}

function draw(scene, stepCount, stepRotationInDegrees) {
    const stepDepth = 5;
    const stepWidth = 10;
    const stepHeight = 1;

    const supportDepth = 0.5; 
    const supportWidth = 1; 
    const verticalSupportRadius = 0.6;
    const spaceBetweenFootsteps = 2;

    var railHeight = 10;
   
    var currentXCoordinate = 0;
    var currentZCoordinate = 0;
    
    setupLight(scene);
    createHelperAxis(scene);
    setupPlane(scene);
  
    var handRailPoints = [];
    for (i = 0; i < stepCount; i++) {
        var boxGeometry = new THREE.BoxGeometry(stepDepth,stepHeight,stepWidth);
        var boxMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        var box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.castShadow = true;

        var stepSupportMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});

        var horizontalSupportLength = stepDepth / 2 + verticalSupportRadius;
        var horizontalStepSupportGeometry = new THREE.BoxGeometry(horizontalSupportLength, supportDepth, supportWidth);
        var horizontalStepSupport = new THREE.Mesh(horizontalStepSupportGeometry, stepSupportMaterial);
        horizontalStepSupport.position.x = horizontalSupportLength / 2;
        var horizontalStepSupportY =  -(stepHeight / 2 + supportDepth / 2);
        horizontalStepSupport.position.y = horizontalStepSupportY;

        var verticalStepSupportGeometry = new THREE.CylinderGeometry(verticalSupportRadius, verticalSupportRadius, stepHeight * 2 + spaceBetweenFootsteps);
        var verticalStepSupport = new THREE.Mesh(verticalStepSupportGeometry, stepSupportMaterial);
        verticalStepSupport.position.x = stepDepth / 2 + verticalSupportRadius;
        verticalStepSupport.position.y = 1;
        verticalStepSupport.position.z = 0;

        var railSupportUnderStepPoint = new THREE.Vector3(0, horizontalStepSupportY, stepWidth / 2 - 1);
        var railSupportCurve = new THREE.Vector3(0, horizontalStepSupportY, stepWidth / 2 + 1);
        var railSupportTop = new THREE.Vector3(0, horizontalStepSupportY + railHeight, stepWidth / 2 + supportDepth / 2);
        var railSupportPath = [railSupportUnderStepPoint, railSupportCurve, railSupportTop];
        var railSupportCurve = new THREE.CatmullRomCurve3(railSupportPath);
        var verticalRailSupportGeometry = new THREE.TubeGeometry(railSupportCurve, 100, supportDepth / 2, 100, false);
        var railSupport = new THREE.Mesh(verticalRailSupportGeometry, stepSupportMaterial);

        var step = new THREE.Object3D();
        step.add(box);
        step.add(horizontalStepSupport);
        step.add(railSupport);
        if (i != stepCount - 1) {
            step.add(verticalStepSupport);
        }

        var stepRotationInRadians = degreesToRadians((stepRotationInDegrees / (stepCount - 1)) * i)

        step.position.x = currentXCoordinate;
        step.position.z = currentZCoordinate;
        step.position.y = supportDepth + (stepHeight / 2) + i * (stepHeight + spaceBetweenFootsteps);
        step.rotation.y = stepRotationInRadians;

        scene.add(step);

        var shift = (stepDepth + 2 * verticalSupportRadius) / 2;
        currentXCoordinate = currentXCoordinate + shift * Math.cos(stepRotationInRadians);
        currentZCoordinate = currentZCoordinate - shift * Math.sin(stepRotationInRadians);
    }

    
}

$(function() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = createRenderer();

    const gui = new dat.GUI();
    const parameters = {
        stepCount: 7,
        stairRotationInDegrees: 90
    }
    gui.add(parameters, 'stepCount', 2, 20)
        .step(1)
        .name('Step count')
        .onChange(() => redraw(scene, parameters.stepCount, parameters.stairRotationInDegrees));
    gui.add(parameters, 'stairRotationInDegrees', 0, 180)
        .step(10)
        .name('Stair rotation')
        .onChange(() => redraw(scene, parameters.stepCount, parameters.stairRotationInDegrees));

    draw(scene, parameters.stepCount, parameters.stairRotationInDegrees);

    camera.position.x = -10;
    camera.position.y = 20;
    camera.position.z = 35;
    camera.lookAt(scene.position);

    // add the output of the renderer to the html element
    $("#WebGL-output").append(renderer.domElement);
    var controls = new THREE.TrackballControls( camera, renderer.domElement );     
    render();

    function render() {
        renderer.render( scene, camera );
        requestAnimationFrame( render );
        controls.update(); 
    }
});