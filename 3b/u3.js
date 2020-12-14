
function createRenderer() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xFFFFFF, 1.0); // background color
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    return renderer;
}

function clearScene(scene) {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
}

function setupLight(scene) {
    var spotLight = new THREE.SpotLight(0x8c8c8c);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    var ambientLight = new THREE.AmbientLight(0xd9d9d9);
    scene.add(ambientLight);
}

function createHelperAxis(scene) {
    // The X axis is red. The Y axis is green. The Z axis is blue.
    const axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);
}

function drawChessBoard(scene, chessBoardTexture) {
    const chessBoardGeometry = new THREE.PlaneGeometry(80, 80);
    const chessBoardMaterial = new THREE.MeshBasicMaterial({ map: chessBoardTexture, side: THREE.DoubleSide });
    const chessBoard = new THREE.Mesh(chessBoardGeometry, chessBoardMaterial);
    chessBoard.receiveShadow = true;
    chessBoard.rotation.x = -0.5 * Math.PI;
    scene.add(chessBoard);
}

function drawBishop(scene) {
    const points = [];
    points.push(new THREE.Vector2(0, 8.38));
    points.push(new THREE.Vector2(0.3025, 8.36125));
    points.push(new THREE.Vector2(0.4425, 8.16125));
    points.push(new THREE.Vector2(0.4025, 7.90125));
    points.push(new THREE.Vector2(0.1625, 7.80125));
    points.push(new THREE.Vector2(0.2225, 7.54125));
    points.push(new THREE.Vector2(0.4025, 7.34125));
    points.push(new THREE.Vector2(0.6025, 7.12125));
    points.push(new THREE.Vector2(0.7625, 6.94125));
    points.push(new THREE.Vector2(0.8025, 6.70125));
    points.push(new THREE.Vector2(0.7425, 6.42125));
    points.push(new THREE.Vector2(0.5625, 6.26125));
    points.push(new THREE.Vector2(0.3225, 6.22125));
    points.push(new THREE.Vector2(0.6425, 5.98125));
    points.push(new THREE.Vector2(0.3025, 5.86125));
    points.push(new THREE.Vector2(0.3025, 5.56125));
    points.push(new THREE.Vector2(0.5425, 5.46125));
    points.push(new THREE.Vector2(0.8025, 5.40125));
    points.push(new THREE.Vector2(1.0425, 5.34125));
    points.push(new THREE.Vector2(1.0625, 5.14125));
    points.push(new THREE.Vector2(0.8025, 5.16125));
    points.push(new THREE.Vector2(0.5225, 5.16125));
    points.push(new THREE.Vector2(0.3625, 5.18125));
    points.push(new THREE.Vector2(0.4025, 4.78125));
    points.push(new THREE.Vector2(0.5225, 4.38125));
    points.push(new THREE.Vector2(0.6625, 3.94125));
    points.push(new THREE.Vector2(0.7825, 3.58125));
    points.push(new THREE.Vector2(0.9025, 3.20125));
    points.push(new THREE.Vector2(1.0625, 2.82125));
    points.push(new THREE.Vector2(1.2625, 2.46125));
    points.push(new THREE.Vector2(1.4225, 2.08125));
    points.push(new THREE.Vector2(1.7025, 2.04125));
    points.push(new THREE.Vector2(1.9425, 1.86125));
    points.push(new THREE.Vector2(1.7425, 1.64125));
    points.push(new THREE.Vector2(1.5025, 1.56125));
    points.push(new THREE.Vector2(1.7625, 1.30125));
    points.push(new THREE.Vector2(2, 1));
    points.push(new THREE.Vector2(2.3025, 0.88125));
    points.push(new THREE.Vector2(2.7025, 0.84125));
    points.push(new THREE.Vector2(2.7025, 0));
    points.push(new THREE.Vector2(0, 0));

    const latheGeometry = new THREE.LatheGeometry(points);
    latheGeometry.computeVertexNormals();
    latheGeometry.computeFaceNormals();
    const bishopMaterial = new THREE.MeshBasicMaterial({ color: 0x2446ab });
    const bishop = new THREE.Mesh(latheGeometry, bishopMaterial);
    bishop.position.y = 0.05;
    scene.add(bishop);
}

function drawBoard(scene) {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = '';
    loader.load(
        'https://i.imgur.com/KOgaj60.png',
        function (chessBoardTexture) {
            drawChessBoard(scene, chessBoardTexture);
            drawBishop(scene);
        });
}

$(function () {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = createRenderer();

    const gui = new dat.GUI();
    // const parameters = {
    //     stepCount: 7,
    //     stairRotationInDegrees: 90,
    //     radius: 0
    // }
    // gui.add(parameters, 'stepCount', 2, 20)
    //     .step(1)
    //     .name('Step count')
    //     .onFinishChange(() => redraw(scene, parameters.stepCount, parameters.stairRotationInDegrees, parameters.radius));

    setupLight(scene);
    drawBoard(scene);


    camera.position.x = -10;
    camera.position.y = 20;
    camera.position.z = 35;
    camera.lookAt(scene.position);

    // add the output of the renderer to the html element
    $("#WebGL-output").append(renderer.domElement);
    var controls = new THREE.TrackballControls(camera, renderer.domElement);
    render();

    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        controls.update();
    }
});