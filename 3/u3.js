const torusRadiusSmall = 3;
const torusRadiusBig = 7;


function setupFloor(scene) {
    var floorGeometry = new THREE.PlaneGeometry(50, 50);
    var floorMaterial = new THREE.MeshLambertMaterial({ color: 0x928875 });
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    floor.rotation.x = -0.5 * Math.PI;
    scene.add(floor);
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

function setupLight(scene) {
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
}

function createHelperAxis(scene) {
    // The X axis is red. The Y axis is green. The Z axis is blue.
    const axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);
}

function addDot(scene, x, y, z) {
    const boxGeometry = new THREE.SphereGeometry(0.05);
    const boxMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.x = x;
    box.position.y = y;
    box.position.z = z;
    box.material.transparent = false;
    box.visible = true;
    scene.add(box);
}

function getRandomNumber() {
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    const numberPadding = torusRadiusBig * 1.5;
    const number = Math.random() * (torusRadiusBig + numberPadding);
    return number * plusOrMinus;
}

function getX(vertex) {
    // u coordinate calculation
    // ϕ = 2πu  =>  u = ϕ / 2π
    const ϕ = Math.atan2(vertex.x, vertex.z);
    return ϕ / (2 * Math.PI) + 0.5;
}

function getY(vertex) {
    // v coordinate calculation
    // ψ = π(v − 1/2)  =>  (v − 1/2) = ψ/π  =>  v = ψ/π + 1/2
    const ϕ = Math.atan2(vertex.x, vertex.z);
    const w = (vertex.x / Math.sin(ϕ)) - torusRadiusBig;
    const ψ = Math.atan2(vertex.y, w);
    return ψ / Math.PI + 0.5;
}

function adjustSeam(face1, face2) {
    const dif = 0.9;
    if (Math.abs(face1.x - face2.x) > dif) {
        console.error(face1, face2);
        const faceToAdjust = face1.x > face2.x ? face1 : face2;
        faceToAdjust.x = 0;
    }
}

function generateTorusPoints(scene) {
    const numberOfPoints = 50000;

    var x = 0;
    var y = 0;
    var z = 0;
    var points = [];

    for (var i = 0; i < numberOfPoints; i++) {
        x = getRandomNumber();
        y = getRandomNumber();
        z = getRandomNumber();

        const lhsSubPart = Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2) - Math.pow(torusRadiusSmall, 2);
        const lhs = Math.pow(lhsSubPart, 2);
        const rhs = 4 * Math.pow(torusRadiusBig, 2) * (Math.pow(x, 2) + Math.pow(z, 2));
        if (lhs <= rhs) {
            points.push(new THREE.Vector3(x, y, z));
        }
    }

    const hullGeometry = new THREE.ConvexGeometry(points);
    const upperLayerFaces2d = hullGeometry.faceVertexUvs[0];
    const geometryFaces3d = hullGeometry.faces;
    const vertices = hullGeometry.vertices;

    const facesCount = upperLayerFaces2d.length;
    var upperLayerFace;
    var geometryFace;
    for (var i = 0; i < facesCount; i++) {
        geometryFace = geometryFaces3d[i];
        const vertex1 = vertices[geometryFace.a];
        const vertex2 = vertices[geometryFace.b];
        const vertex3 = vertices[geometryFace.c];

        upperLayerFace = upperLayerFaces2d[i];

        upperLayerFace[0].x = getX(vertex1);
        upperLayerFace[0].y = getY(vertex1);

        upperLayerFace[1].x = getX(vertex2);
        upperLayerFace[1].y = getY(vertex2);

        upperLayerFace[2].x = getX(vertex3);
        upperLayerFace[2].y = getY(vertex3);

        adjustSeam(upperLayerFace[0], upperLayerFace[1]);
        adjustSeam(upperLayerFace[1], upperLayerFace[2]);
        adjustSeam(upperLayerFace[2], upperLayerFace[0]);
    }

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = '';
    loader.load(
        'https://i.imgur.com/KOgaj60.png',
        function (chessTexture) {
            console.error("mo", chessTexture);

            const chessTextureMaterial = new THREE.MeshPhongMaterial();
            chessTextureMaterial.map = chessTexture;
            chessTextureMaterial.transparent = true;

            // const basicMaterial = new THREE.MeshLambertMaterial({ color: 0xe5a970 });
            const mesh = THREE.SceneUtils.createMultiMaterialObject(hullGeometry, [chessTextureMaterial]);

            scene.add(mesh);
        });
}


$(function () {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = createRenderer();

    // setupFloor(scene);
    setupLight(scene);
    // createHelperAxis(scene);

    generateTorusPoints(scene);


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