function createPlane() {
    var groundPlaneGeometry = new THREE.PlaneGeometry(50, 50);
    var groundPlaneMaterial =    new THREE.MeshLambertMaterial({color: 0xffffff});
    var groundPlane = new THREE.Mesh(groundPlaneGeometry, groundPlaneMaterial);
    groundPlane.receiveShadow  = true;

    groundPlane.rotation.x = -0.5 * Math.PI;
    groundPlane.position.x = 15;
    groundPlane.position.y = 0;
    groundPlane.position.z = 0;

    return groundPlane;
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

$(function() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); // vertical frustum, aspect ratio, near groundPlane, far groundPlane
    var renderer = createRenderer();
    var groundPlane = createPlane();
    scene.add(groundPlane);

    //The X axis is red. The Y axis is green. The Z axis is blue.
    const axesHelper = new THREE.AxesHelper(20);
    scene.add( axesHelper );

    // create box
    var stepDepth = 5;
    var stepWidth = 10;
    var stepHeight = 1;

    var supportDepth = 0.5; 
    var supportWidth = 1; 
    var spaceBetweenFootsteps = 2;
   

    var step,  box;
    var currentXCoordinate = 0;
    var currentZCoordinate = 0;

    var stairRotationInDegrees = 90;
    var verticalSupportRadius = 0.6;

    var stepCount = 7;

    for (i = 0; i < stepCount; i++) {
        var boxGeometry = new THREE.BoxGeometry(stepDepth,stepHeight,stepWidth);
        var boxMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.castShadow = true;

        var stepSupportMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});

        var horizontalSupportLength = stepDepth / 2 + verticalSupportRadius;
        var horizontalStepSupportGeometry = new THREE.BoxGeometry(horizontalSupportLength, supportDepth, supportWidth);
        var horizontalStepSupport = new THREE.Mesh(horizontalStepSupportGeometry, stepSupportMaterial);
        horizontalStepSupport.position.x = horizontalSupportLength / 2;
        horizontalStepSupport.position.y = -(stepHeight / 2 + supportDepth / 2);

        var verticalStepSupportGeometry = new THREE.CylinderGeometry(verticalSupportRadius, verticalSupportRadius, stepHeight * 2 + spaceBetweenFootsteps);
        var verticalStepSupport = new THREE.Mesh(verticalStepSupportGeometry, stepSupportMaterial);
        verticalStepSupport.position.x = stepDepth / 2 + verticalSupportRadius;
        verticalStepSupport.position.y = 1;
        verticalStepSupport.position.z = 0;

        step = new THREE.Object3D();
        step.add(box);
        step.add(horizontalStepSupport);
        if (i != stepCount - 1) {
            step.add(verticalStepSupport);
        }

        step.position.x = currentXCoordinate;
        step.position.z = currentZCoordinate;
        step.position.y = supportDepth + (stepHeight / 2) + i * (stepHeight + spaceBetweenFootsteps);
        var stepRotationInRadians = degreesToRadians((stairRotationInDegrees / (stepCount - 1)) * i)
        step.rotation.y = stepRotationInRadians;

        scene.add(step);

        var shift = (stepDepth + 2 * verticalSupportRadius) / 2;
        currentXCoordinate = currentXCoordinate + shift * Math.cos(stepRotationInRadians);
        currentZCoordinate = currentZCoordinate - shift * Math.sin(stepRotationInRadians);
    }
  

    camera.position.x = 0;
    camera.position.y = 10;
    camera.position.z = 35;
    camera.lookAt(scene.position);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set( -40, 60, -10 );
    spotLight.castShadow = true;
    scene.add( spotLight );

    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

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