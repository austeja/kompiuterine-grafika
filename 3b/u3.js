function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

const bishopPoints = [
    new THREE.Vector2(0, 8.38),
    new THREE.Vector2(0.3025, 8.36125),
    new THREE.Vector2(0.4425, 8.16125),
    new THREE.Vector2(0.4025, 7.90125),
    new THREE.Vector2(0.1625, 7.80125),
    new THREE.Vector2(0.2225, 7.54125),
    new THREE.Vector2(0.4025, 7.34125),
    new THREE.Vector2(0.6025, 7.12125),
    new THREE.Vector2(0.7625, 6.94125),
    new THREE.Vector2(0.8025, 6.70125),
    new THREE.Vector2(0.7425, 6.42125),
    new THREE.Vector2(0.5625, 6.26125),
    new THREE.Vector2(0.3225, 6.22125),
    new THREE.Vector2(0.6425, 5.98125),
    new THREE.Vector2(0.3025, 5.86125),
    new THREE.Vector2(0.3025, 5.56125),
    new THREE.Vector2(0.5425, 5.46125),
    new THREE.Vector2(0.8025, 5.40125),
    new THREE.Vector2(1.0425, 5.34125),
    new THREE.Vector2(1.0625, 5.14125),
    new THREE.Vector2(0.8025, 5.16125),
    new THREE.Vector2(0.5225, 5.16125),
    new THREE.Vector2(0.3625, 5.18125),
    new THREE.Vector2(0.4025, 4.78125),
    new THREE.Vector2(0.5225, 4.38125),
    new THREE.Vector2(0.6625, 3.94125),
    new THREE.Vector2(0.7825, 3.58125),
    new THREE.Vector2(0.9025, 3.20125),
    new THREE.Vector2(1.0625, 2.82125),
    new THREE.Vector2(1.2625, 2.46125),
    new THREE.Vector2(1.4225, 2.08125),
    new THREE.Vector2(1.7025, 2.04125),
    new THREE.Vector2(1.9425, 1.86125),
    new THREE.Vector2(1.7425, 1.64125),
    new THREE.Vector2(1.5025, 1.56125),
    new THREE.Vector2(1.7625, 1.30125),
    new THREE.Vector2(2, 1),
    new THREE.Vector2(2.3025, 0.88125),
    new THREE.Vector2(2.7025, 0.84125),
    new THREE.Vector2(2.7025, 0),
    new THREE.Vector2(0, 0)
];

const boardLetters = 'ABCDEFGH';
const boardEdgeSize = 80;
const cellEdgeSize = 9.2;
const animationStepCount = 100;

var scene, camera, renderer, controls;

function createRenderer() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xFFFFFF, 1.0);
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
    const chessBoardGeometry = new THREE.PlaneGeometry(boardEdgeSize, boardEdgeSize);
    const chessBoardMaterial = new THREE.MeshBasicMaterial({ map: chessBoardTexture, side: THREE.DoubleSide });
    const chessBoard = new THREE.Mesh(chessBoardGeometry, chessBoardMaterial);
    chessBoard.receiveShadow = true;
    chessBoard.rotation.x = -0.5 * Math.PI;
    scene.add(chessBoard);
}

async function goToCellOnBoard(letter, number, bishop) {
    console.error('bishop starting coordinates', bishop.position.x, bishop.position.z);

    const letterIndex = boardLetters.indexOf(letter.toUpperCase());
    if (letterIndex == -1) {
        alert('Invalid board letter');
        return;
    }
    if (number < 1 || number > 8) {
        alert('Invalid board number');
        return;
    }

    const adjustedIndex = 7 - letterIndex;
    const xCoordinate = cellEdgeSize / 2 + (3 - adjustedIndex) * cellEdgeSize;

    const adjustedNumber = 9 - number;
    const zCoordinate = cellEdgeSize / 2 + (adjustedNumber - 5) * cellEdgeSize;

    const xDelta = xCoordinate - bishop.position.x;
    const zDelta = zCoordinate - bishop.position.z;
    const xStep = xDelta / animationStepCount;
    const zStep = zDelta / animationStepCount;
    for (var i = 0; i <= animationStepCount; i++) {
        bishop.position.x += xStep;
        bishop.position.z += zStep;
        await sleep(15);
    }
}

function drawBishop(scene) {
    const latheGeometry = new THREE.LatheGeometry(bishopPoints);
    latheGeometry.computeVertexNormals();
    latheGeometry.computeFaceNormals();
    const bishopMaterial = new THREE.MeshBasicMaterial({ color: 0x2446ab });
    const bishop = new THREE.Mesh(latheGeometry, bishopMaterial);
    bishop.position.y = 0.05;
    bishop.position.x = boardEdgeSize / 8 / 2;
    scene.add(bishop);
    return bishop;
}

async function drawBoard(scene) {
    const loader = new THREE.TextureLoader();
    const promise = new Promise((resolve, reject) => {
        loader.load(
            'https://i.imgur.com/LsAGXuS.png',
            async function (chessBoardTexture) {
                drawChessBoard(scene, chessBoardTexture);
                const bishop = drawBishop(scene);
                resolve(bishop);
            });
    });

    return promise;
}

function doDollyZoom(camera, bishop) {
    // camera.position.x = 0;
    // camera.position.y = 10;
    // camera.position.z = 60;
    camera.lookAt(bishop.position);
    console.error(bishop.position);
    // this.cameraPosition = 3;
}

function initializeControls(bishopStartingPositionLetter, bishopStartingPositionNumber, bishop, camera) {
    const gui = new dat.GUI();
    const parameters = {
        moveToLetter: bishopStartingPositionLetter,
        moveToNumber: bishopStartingPositionNumber
    }

    gui.add(parameters, 'moveToLetter')
        .name('Move to letter');
    gui.add(parameters, 'moveToNumber', 1, 8)
        .step(1)
        .name('Move to number');

    const funcHolder = {
        move: () => goToCellOnBoard(parameters.moveToLetter, parameters.moveToNumber, bishop),
        dollyZoom: () => doDollyZoom(camera, bishop)
    };
    gui.add(funcHolder, 'move').name('Move');
    gui.add(funcHolder, 'dollyZoom').name('Dolly zoom');
}

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    controls.update();
}

async function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = -10;
    camera.position.y = 20;
    camera.position.z = 35;
    camera.lookAt(scene.position);

    createHelperAxis(scene);
    setupLight(scene);

    const bishop = await drawBoard(scene);
    goToCellOnBoard('A', 1, bishop);
    initializeControls('A', 1, bishop, camera);

    renderer = createRenderer();
    $("#WebGL-output").append(renderer.domElement);
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    render();
}



init();