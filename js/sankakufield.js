var scene, camera, renderer;
var fields = [];
var fieldSpeed = 0.0025;
var mouseX = 0, mouseY = 0;
var WIDTH, HEIGHT;

init();
draw();

function init(element){
    scene = new THREE.Scene();

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    setRenderer();
    setCamera();
    setScene();

    window.addEventListener('resize', function(){
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;

        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });

    document.onmousemove = updateMouseValues;
    document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
}

function updateMouseValues(event){
    mouseX = event.clientX - (WIDTH / 2);
    mouseY = event.clientY - (HEIGHT / 2);
}

function onDocumentMouseWheel(event){
    var speedMax = 0.05;
    var speedMin = 0.0005;

    var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

    fieldSpeed += delta / 1000;
    fieldSpeed = Math.max( Math.min (fieldSpeed, speedMax), speedMin);
}

function setRenderer(){
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    renderer.setClearColor(0x000000);
}

function setCamera(){
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.1, 20000);
    camera.position.set(0,0,1000);
    scene.add(camera);
}

function setScene(){
    field = new THREE.Object3D();

    setSankaku();

    var light = new THREE.PointLight(0xffffff, 4.5, 0);
    light.position.set(1,1,100);
    scene.add(light);

    addSpaceStuff(2000, new THREE.TextureLoader().load( 'images/glow.png' ), 0x9ca8d3, 15);
    addSpaceStuff(100, new THREE.TextureLoader().load( 'images/glow.png' ), 0xe01616, 35);
    addSpaceStuff(30, new THREE.TextureLoader().load('images/blackhole.png'), 0xffffff, 30);
    addSpaceStuff(10, new THREE.TextureLoader().load( 'images/shellcasing.png' ), 0xffffff, 35);
    addSpaceStuff(1, new THREE.TextureLoader().load( 'images/jewel.png' ), 0xffffff, 100);
}

function setSankaku(){
    var sankakuMaterial = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load( 'images/up.png' )
    });
    sankakuMaterial.transparent = true;

    var geometry = new THREE.PlaneGeometry(586, 586);

    var mesh = new THREE.Mesh(geometry, sankakuMaterial);
    mesh.position.set(0,0,0);
    scene.add(mesh);
}


function addSpaceStuff(amount, sprite, color, size){
    var spaceGeometry = new THREE.Geometry();
    material = new THREE.PointsMaterial( { size: size, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: false} );
    material.color.set(color);

    for(var i=0; i < amount; i++){
        var spaceObject = new THREE.Vector3();
        spaceObject.x = THREE.Math.randFloatSpread(3000);
        spaceObject.y = THREE.Math.randFloatSpread(3000);
        spaceObject.z = THREE.Math.randFloatSpread(3000);

        spaceGeometry.vertices.push(spaceObject);
    }

    var field = new THREE.Points(spaceGeometry, material);
    fields.push(field);
    scene.add(field);
}

function draw(){
    requestAnimationFrame(draw);

    render();
}

function render(){
    camera.position.x += (mouseX - camera.position.x) * 0.003;
    camera.position.y += (- mouseY - camera.position.y) * 0.003;

    camera.position.x = Math.max( Math.min (camera.position.x, 100), -100);
    camera.position.y = Math.max( Math.min (camera.position.y, 100), -100);

    for(var i=0; i < fields.length; i++){
        fields[i].rotation.x += fieldSpeed / 2;
        fields[i].rotation.y += fieldSpeed;
    }

    renderer.render(scene, camera);
}
