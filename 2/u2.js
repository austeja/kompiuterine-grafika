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

    var boundingBoxDepth = 7;
    var boundingBoxWidth = 14;


    var supportDepth = 0.5; 
    var supportWidth = 1; 
    var spaceBetweenFootsteps = 2;
   

    var step, frame, box;
    var currentXCoordinate = 0;
    var currentZCoordinate = 0;

    var stairRotationInDegrees = 45;

    var verticalSupportRadius = 0.6;

    var targetpointz = 4 + 5; 
    var targetpointx = 2.5 + 0.6;

    // stack of boxes
    for (i = 0; i < 2; i++) {
        var boxGeometry = new THREE.BoxGeometry(stepDepth,stepHeight,stepWidth);
        var boxMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        box = new THREE.Mesh(boxGeometry, boxMaterial);

        box.castShadow = true;
        // box.position.x  = boundingBoxDepth - stepDepth / 2;
        box.position.z = boundingBoxWidth - stepWidth / 2;

        var frameGeometry = new THREE.BoxGeometry(2 * boundingBoxDepth, stepHeight , 2 * boundingBoxWidth);
        var frameMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc, wireframe: true});
        frame = new THREE.Mesh(frameGeometry, frameMaterial);

        var stepSupportMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});

        var horizontalStepSupportGeometry = new THREE.BoxGeometry(verticalSupportRadius + stepDepth, supportDepth, supportWidth);
        var horizontalStepSupport = new THREE.Mesh(horizontalStepSupportGeometry, stepSupportMaterial);
        horizontalStepSupport.position.x = verticalSupportRadius;
        horizontalStepSupport.position.y = -(stepHeight / 2 + supportDepth / 2);
        horizontalStepSupport.position.z = boundingBoxWidth - stepWidth / 2;

        var verticalStepSupportGeometry = new THREE.CylinderGeometry(verticalSupportRadius, verticalSupportRadius, stepHeight * 2 + spaceBetweenFootsteps);
        var verticalStepSupport = new THREE.Mesh(verticalStepSupportGeometry, stepSupportMaterial);
        verticalStepSupport.position.x = stepDepth / 2 + verticalSupportRadius;
        verticalStepSupport.position.y = supportDepth;
        verticalStepSupport.position.z = boundingBoxWidth - stepWidth / 2;

        // //todo:: add rails!!!
        // var points = [];
        // points.push(new THREE.Vector3(0, 1, 1));	
        // points.push(new THREE.Vector3(0, 1, 2));	
        // var railGeometry = new THREE.TubeGeometry(new THREE.SplineCurve3(points), 10, 0.4, 10, false);
        // var rails = THREE.SceneUtils.createMultiMaterialObject(railGeometry, [stepSupportMaterial]);

        step = new THREE.Object3D();
        step.add(box);
        step.add(frame);
        step.add(horizontalStepSupport);
        step.add(verticalStepSupport);
        // step.add(rails);

        step.position.x = currentXCoordinate;
        step.position.z = currentZCoordinate;
        step.position.y = supportDepth + (stepHeight / 2) + i * (stepHeight + spaceBetweenFootsteps);
        step.rotation.y = degreesToRadians(stairRotationInDegrees) * i;//Math.atan((stepDepth / 2) / stepWidth) * i; // step rotation

        scene.add(step);

       
        var z = 4 + 5;
        var x = -2.5 + 0.6;
        var zafter = x * Math.sin(degreesToRadians(-stairRotationInDegrees * (i + 1))) + z * Math.cos(degreesToRadians(-stairRotationInDegrees * (i + 1)))
        var xafter = x * Math.cos(degreesToRadians(-stairRotationInDegrees * (i + 1))) - z * Math.sin(degreesToRadians(-stairRotationInDegrees * (i + 1)));

        targetpointz = 4 + 5; 
        targetpointx = 2.5 + 0.6;
        var distance = Math.sqrt(Math.pow(zafter - targetpointz, 2) + Math.pow(xafter - targetpointx, 2));


        var deltax = distance * Math.sin(degreesToRadians(stairRotationInDegrees));
        var deltaz = distance * Math.cos(degreesToRadians(stairRotationInDegrees));

        console.error(distance);

        
        currentXCoordinate = currentXCoordinate - deltax;
        currentZCoordinate = currentZCoordinate + deltaz - 0.5;
    }
  
    // position and point the camera to the center of the scene
    camera.position.x = 0;
    camera.position.y = 10;
    camera.position.z = 35;
    camera.lookAt(scene.position);

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( -40, 60, -10 );
    spotLight.castShadow = true;
    scene.add( spotLight );

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