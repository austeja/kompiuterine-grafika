const boardLetters = 'ABCDEFGH';
const boardEdgeSize = 80;
const cellEdgeSize = 9.2;
const animationStepCount = 100;
const cameraSwitchZone = 4;
let forward = true;


var scene, camera, renderer, controls, bishop, dot, line, line2, line3, line4, line5, nearPlane;
var wireframeLines = [];
var parameters = {
    camera1_fov: 45,
    camera2_fov: 45,
    camera2_distance: 5,
    camera2_showWireframe: false,
    moveToLetter: 'D',
    moveToNumber: 4,
    cameraNumber: 1,
}

const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

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

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

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
    axesHelper.position.y = 0.1;
    scene.add(axesHelper);
}

function drawChessBoard(scene, chessBoardTexture) {
    const chessBoardGeometry = new THREE.PlaneGeometry(boardEdgeSize, boardEdgeSize);
    const chessBoardMaterial = new THREE.MeshBasicMaterial({ map: chessBoardTexture, side: THREE.DoubleSide });
    const chessBoard = new THREE.Mesh(chessBoardGeometry, chessBoardMaterial);
    chessBoard.receiveShadow = true;
    chessBoard.position.x = 4.3;
    chessBoard.position.z = 4.3;
    chessBoard.rotation.x = -0.5 * Math.PI;
    scene.add(chessBoard);
}

async function goToCellOnBoard(letter, number, bishop) {
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
    latheGeometry.mergeVertices()
    latheGeometry.computeVertexNormals();
    latheGeometry.computeFaceNormals();
    const bishopMaterial = new THREE.MeshLambertMaterial({ color: 0x2446ab });
    bishopMaterial.side = THREE.DoubleSide;
    const bishop = new THREE.Mesh(latheGeometry, bishopMaterial);
    bishop.position.y = 0.05;
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

async function moveBackAndForth() {
    while (parameters.cameraNumber == 3) {
        var step;
        if (bishop.position.z <= cameraSwitchZone && bishop.position.z >= -cameraSwitchZone) {
            step = 0.025;
        } else {
            step = 0.1;
        }

        if (forward) {
            bishop.position.z += step;
        } else {
            bishop.position.z -= step;
        }

        if (forward && bishop.position.z > 35) {
            forward = false;
        }
        if (!forward && bishop.position.z < -35) {
            forward = true;
        }

        await sleep(15);
    }
}

function initializeControls(bishop, camera) {
    const funcHolder = {
        move: () => goToCellOnBoard(parameters.moveToLetter, parameters.moveToNumber, bishop),
        moveInLine: () => moveBackAndForth()
    };

    const gui = new dat.GUI();
    gui.add(parameters, 'cameraNumber', 1, 3)
        .step(1)
        .name('Camera number');

    const bishopControls = gui.addFolder('Bishop controls');
    bishopControls.add(funcHolder, 'move').name('Move');
    bishopControls.add(parameters, 'moveToLetter')
        .name('Move to letter');
    bishopControls.add(parameters, 'moveToNumber', 1, 8)
        .step(1)
        .name('Move to number');

    const camera1Controls = gui.addFolder('Camera 1 controls');
    camera1Controls.add(parameters, 'camera1_fov', 1, 179)
        .step(1)
        .name('Camera 1 FOV angle');

    const camera2Controls = gui.addFolder('Camera 2 controls');
    camera2Controls.add(parameters, 'camera2_distance', 5, 300)
        .name('Camera 2 distance');
    camera2Controls.add(parameters, 'camera2_showWireframe')
        .name('Show wireframe');

    const camera3Controls = gui.addFolder('Camera 3 controls');
    camera3Controls.add(funcHolder, 'moveInLine').name('Move back and forth');
}

function addDot(x, y, z) {
    const boxGeometry = new THREE.SphereGeometry(0.2);
    const boxMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.x = x;
    box.position.y = y;
    box.position.z = z;
    box.material.transparent = false;
    box.visible = true;
    scene.add(box);
    return box;
}
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function render() {
    if (parameters.cameraNumber == 1) {
        bishop.position.x = 0;
        bishop.position.z = 0;
        camera.up = new THREE.Vector3(0, 1, 0);
        for (var i = 0; i < wireframeLines.length; i++) {
            scene.remove(wireframeLines[i]);
        }
        if (dot) {
            scene.remove(dot);
        }

        camera.position.x = 0;
        camera.position.y = 60;
        camera.position.z = 105;
        camera.fov = parameters.camera1_fov;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.updateProjectionMatrix();
    }

    if (parameters.cameraNumber == 2) {
        bishop.position.x = 0;
        bishop.position.z = 0;
        camera.up = new THREE.Vector3(0, 1, 0);

        const distance = parameters.camera2_distance;
        const fov = 2 * Math.atan(boardEdgeSize / (2 * parameters.camera2_distance)) * (180 / Math.PI);

        const camerax = 0;
        const cameray = 20;

        if (parameters.camera2_showWireframe) {
            if (!dot) {
                dot = addDot(camerax, cameray, distance);
            }
            dot.visible = true;

            camera.position.x = 50;
            camera.position.y = 50;
            camera.position.z = -50;
            camera.fov = 45;

            dot.position.z = distance;
            camera.lookAt(camerax, cameray, 30);
            //camera.lookAt(0, 0, 0);
            camera.updateProjectionMatrix();

            for (var i = 0; i < wireframeLines.length; i++) {
                scene.remove(wireframeLines[i]);
            }

            const cameraPoint = new THREE.Vector3(camerax, cameray, distance);
            const lookAtVector = new THREE.Vector3(bishop.position.x, bishop.position.y, bishop.position.z);
            lookAtVector.sub(cameraPoint);
            lookAtVector.normalize();

            const ratio = window.innerHeight / window.innerWidth;
            const dist = Math.sqrt(Math.pow(distance, 2) + Math.pow(cameray, 2))
            const calculatedX = dist * Math.tan(degreesToRadians(fov / 2));
            const calculatedY = calculatedX * ratio;


            const bottomLeftVector = new THREE.Vector3(calculatedX, -calculatedY, bishop.position.z);
            bottomLeftVector.sub(cameraPoint);
            bottomLeftVector.normalize();

            const bottomRightVector = new THREE.Vector3(-calculatedX, -calculatedY, bishop.position.z);
            bottomRightVector.sub(cameraPoint);
            bottomRightVector.normalize();

            const upperLeftVector = new THREE.Vector3(calculatedX, calculatedY, bishop.position.z);
            upperLeftVector.sub(cameraPoint);
            upperLeftVector.normalize();

            const upperRightVector = new THREE.Vector3(-calculatedX, calculatedY, bishop.position.z);
            upperRightVector.sub(cameraPoint);
            upperRightVector.normalize();

            ///
            const upVector = lookAtVector.clone();
            upVector.applyAxisAngle(new THREE.Vector3(1, 0, 0), degreesToRadians(90));
            upVector.normalize();

            const thirdVector = lookAtVector.clone();
            thirdVector.cross(upVector);
            thirdVector.normalize();
            // console.error(upVector, lookAtVector);

            const temp = lookAtVector.clone();
            temp.applyAxisAngle(upVector, degreesToRadians(fov / 2));
            temp.normalize();

            const finalRotate = thirdVector.clone();
            finalRotate.applyAxisAngle(upVector, degreesToRadians(fov / 2));
            finalRotate.normalize();

            const corner1 = temp.clone();
            corner1.applyAxisAngle(finalRotate, degreesToRadians(fov / 2 * ratio));
            corner1.normalize();

            const corner2 = temp.clone();
            corner2.applyAxisAngle(finalRotate, degreesToRadians(-fov / 2 * ratio));
            corner2.normalize();

            const temp2 = lookAtVector.clone();
            temp2.applyAxisAngle(upVector, degreesToRadians(-fov / 2));
            temp2.normalize();

            const finalRotate2 = thirdVector.clone();
            finalRotate2.applyAxisAngle(upVector, degreesToRadians(-fov / 2));
            finalRotate2.normalize();

            const corner3 = temp2.clone();
            corner3.applyAxisAngle(finalRotate2, degreesToRadians(-fov / 2 * ratio));
            corner3.normalize();

            const corner4 = temp2.clone();
            corner4.applyAxisAngle(finalRotate2, degreesToRadians(fov / 2 * ratio));
            corner4.normalize();


            wireframePoints = [
                // [cameraPoint, cameraPoint.clone().addScaledVector(upVector, 10)],
                // [cameraPoint, cameraPoint.clone().addScaledVector(thirdVector, 10)],
                // [cameraPoint, cameraPoint.clone().addScaledVector(temp, 200)],
                [cameraPoint, cameraPoint.clone().addScaledVector(corner1, 200)],
                [cameraPoint, cameraPoint.clone().addScaledVector(corner2, 200)],
                [cameraPoint, cameraPoint.clone().addScaledVector(corner3, 200)],
                [cameraPoint, cameraPoint.clone().addScaledVector(corner4, 200)],
                // [cameraPoint, cameraPoint.clone().addScaledVector(lookAtVector, 10)],
                //[cameraPoint, cameraPoint.clone().addScaledVector(bottomLeftVector, 100)],
                //[cameraPoint, cameraPoint.clone().addScaledVector(bottomRightVector, 100)],
                //[cameraPoint, cameraPoint.clone().addScaledVector(upperLeftVector, 100)],
                //[cameraPoint, cameraPoint.clone().addScaledVector(upperRightVector, 100)],
                [cameraPoint.clone().addScaledVector(corner1, 20), cameraPoint.clone().addScaledVector(corner2, 20)],
                [cameraPoint.clone().addScaledVector(corner2, 20), cameraPoint.clone().addScaledVector(corner3, 20)],
                [cameraPoint.clone().addScaledVector(corner3, 20), cameraPoint.clone().addScaledVector(corner4, 20)],
                [cameraPoint.clone().addScaledVector(corner4, 20), cameraPoint.clone().addScaledVector(corner1, 20)],
                [cameraPoint.clone().addScaledVector(corner1, 200), cameraPoint.clone().addScaledVector(corner2, 200)],
                [cameraPoint.clone().addScaledVector(corner2, 200), cameraPoint.clone().addScaledVector(corner3, 200)],
                [cameraPoint.clone().addScaledVector(corner3, 200), cameraPoint.clone().addScaledVector(corner4, 200)],
                [cameraPoint.clone().addScaledVector(corner4, 200), cameraPoint.clone().addScaledVector(corner1, 200)],
            ];

            for (var i = 0; i < wireframePoints.length; i++) {
                let line;
                if (i <= 3) {
                    let lineMaterial2 = new THREE.LineBasicMaterial({ color: 0xff0000 });
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints(wireframePoints[i]);
                    line = new THREE.Line(lineGeometry, lineMaterial2);
                }
                else {
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints(wireframePoints[i]);
                    line = new THREE.Line(lineGeometry, lineMaterial);

                }
                scene.add(line);
                wireframeLines.push(line);
            }
        } else {
            if (dot) {
                dot.visible = false;
            }

            for (var i = 0; i < wireframeLines.length; i++) {
                scene.remove(wireframeLines[i]);
            }

            camera.position.x = camerax;
            camera.position.y = cameray;
            camera.position.z = distance;
            camera.fov = fov;
            camera.lookAt(bishop.position);
            camera.updateProjectionMatrix();
        }

    }

    if (parameters.cameraNumber == 3) {
        camera.position.x = 0;
        camera.position.y = 110;
        camera.position.z = 0;
        camera.fov = 45;
        for (var i = 0; i < wireframeLines.length; i++) {
            scene.remove(wireframeLines[i]);
        }
        if (dot) {
            scene.remove(dot);
        }

        if ((bishop.position.z > 0 && bishop.position.z <= cameraSwitchZone) || (bishop.position.z < 0 && bishop.position.z >= -cameraSwitchZone)) {
            camera.up = new THREE.Vector3(
                Math.cos(Math.PI / 2 * (Math.abs(bishop.position.z) / cameraSwitchZone)),
                Math.sin(Math.PI / 2 * (Math.abs(bishop.position.z) / cameraSwitchZone)),
                0)
                .normalize();
        }
        else {
            camera.up = new THREE.Vector3(0, 1, 0);
        }

        camera.lookAt(bishop.position);
        camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

async function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);


    // createHelperAxis(scene);
    setupLight(scene);

    bishop = await drawBoard(scene);
    scene.updateMatrixWorld();
    // await goToCellOnBoard(parameters.moveToLetter, parameters.moveToNumber, bishop);
    initializeControls(bishop, camera);


    renderer = createRenderer();
    $("#WebGL-output").append(renderer.domElement);
    render();
}

init();