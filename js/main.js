// create a world for the canvas
var myWorld = new World("myCanvas");

// global paramaters for different rendering options
var params = {
    ArcBallView: true,
    TopView: false,
    TrainView: false,
    ArcLength: true,
    CurveSegments: 20,
    Speed: 20,
    realTime: true,
    Run: true,
    Bspline: false,
    addPoint: function () {
        addPoint(myWorld);
    },
    removePoint: function () {
        removePoint(myWorld);
    },
    addCar: function () {
        train.addCar();
    },
    removeCar: function () {
        train.removeCar();
    },
    loadPoints: function () {
        document.getElementById("txtfiletoread").click();
    }
};

// PLANE
var planeGeometry = new THREE.PlaneGeometry(500, 500, 100, 100);
var loader = new THREE.TextureLoader();
loader.setCrossOrigin("anonymous");
var texture = loader.load('images/city.jpg');
var material = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
    wireframe: false
});
var plane = new THREE.Mesh(planeGeometry, material);
plane.receiveShadow = true;
plane.rotation.x = -90 * (Math.PI / 180);
myWorld.addObject(plane);

// control points
var CP1 = new ControlPoint(150, 20, 150, myWorld);
var CP2 = new ControlPoint(150, 20, -150, myWorld);
var CP3 = new ControlPoint(-150, 20, -150, myWorld);
var CP4 = new ControlPoint(-150, 20, 150, myWorld);
//currently chosen control point
var chosenCP = null;

//Train
var train = new Train(myWorld, "myCanvas");
train.addCar();
train.addCar();

// curves
var curvesMeshes = [];
var curves = [];
// record the index of the curve each car is on
var cur_curve = 0;
var cur_curves = [];

// the meshes of rail ties
var rails = [];
// the normals for each point on each curve, depending on number of curve segments
var normals = [];

// import model 
var objLoader = new THREE.OBJLoader();
objLoader.load("objects/building.obj", function (object) {
    object.position.x = 60;
    object.position.z = 50;
    object.color = 0xFFDF00;
    myWorld.addObject(object);
});

// light
var spotlight = new THREE.SpotLight(0xffffff, 1.3, 1500);
spotlight.position.set(0, 500, 0);
spotlight.shadow.camera.near = 0.1;
spotlight.shadow.camera.far = 1000;
spotlight.castShadow = true;
myWorld.addObject(spotlight);

// Animation Parameters

// paramters for curve switching
var switch_curve = false;
var switched = false;
var next_curve = 0;

// total time
var time = 0;
// looptime
var looptime = 20 * 200;
// current time stamp in range 0 to 1 for the head car
var t;
// record how much time should increment when render() is called for each curve
var time_increments = [];
var times = [];
var distances = [];

// Controls
var dragControls = new THREE.DragControls(draggableObjects, myWorld.camera, myWorld.renderer.domElement);
dragControls.addEventListener("dragstart", dragStartCallBack);
dragControls.addEventListener("dragend", dragEndCallBack);

// UI
setupUI();

// main
setUpreload(myWorld);
drawCurves(params.CurveSegments);
computeNormals(params.CurveSegments);
computerTimeIncrements();
drawRail(params.CurveSegments);
myWorld.renderer.setAnimationLoop(render);

// temporary number of curve Segments, subject to change.
var temp_curveSegments = 20;

// main render function called every frame
function render() {
    var cur_curveSegments;
    if (params.realTime) {
        cur_curveSegments = Math.round(params.CurveSegments);
        temp_curveSegments = Math.round(params.CurveSegments);
        drawCurves(cur_curveSegments);
        computeNormals(cur_curveSegments);
        computerTimeIncrements();
        drawRail(cur_curveSegments);
    } else {
        cur_curveSegments = temp_curveSegments;
    }

    // general animation parameter
    t = (time % looptime) / looptime;
    cur_curves = [];
    cur_curves.push(cur_curve);
    times = [];
    times.push(t);

    // calculate the curves each train is on, and the time stamp of each train.
    // used for pinpointing the position of each car , 
    // recorded in variables  - times and cur_curves
    for (var i = 1; i < train.meshes.length; i++) {
        var head_time = times[i - 1];
        var distance1 = head_time * curves[cur_curves[i - 1]].getLength();
        var temp_dist;
        if (i == 1) {
            temp_dist = distance1 - 40;
        } else {
            temp_dist = distance1 - 35;
        }

        // if on the same curve
        if (temp_dist >= 0) {
            cur_curves.push(cur_curves[i - 1]);
            times.push(temp_dist / curves[cur_curves[i - 1]].getLength());
        }
        //if not on the same curve
        else {
            var to_push_cur_curve = cur_curves[i - 1] == 0 ? curves.length - 1 : cur_curves[i - 1] - 1;
            temp_dist = curves[to_push_cur_curve].getLength() + temp_dist;
            cur_curves.push(to_push_cur_curve);
            times.push(temp_dist / curves[to_push_cur_curve].getLength());
        }
    }

    // position of the head car
    var pos = curves[cur_curve].getPointAt(t);

    // update train positions
    if (!switched) {
        train.position(0).copy(pos);
        for (var i = 1; i < train.meshes.length; i++) {
            var temp_t = times[i];
            train.position(i).copy(curves[cur_curves[i]].getPointAt(temp_t));
        }
    }

    // update train orientation
    if (t < 0.987) {
        train.lookAt(0, curves[cur_curve].getPointAt(t + 0.001));
        train.up(0).x = normals[cur_curve][Math.round(t * cur_curveSegments)].x;
        train.up(0).y = normals[cur_curve][Math.round(t * cur_curveSegments)].y;
        train.up(0).z = normals[cur_curve][Math.round(t * cur_curveSegments)].z;
        for (var i = 1; i < train.meshes.length; i++) {
            var temp_t = times[i];
            if (temp_t < 0) {
                temp_t = 0;
            }
            train.lookAt(i, curves[cur_curves[i]].getPointAt(temp_t + 0.001));
            train.up(i).x = normals[cur_curves[i]][Math.round(temp_t * cur_curveSegments)].x;
            train.up(i).y = normals[cur_curves[i]][Math.round(temp_t * cur_curveSegments)].y;
            train.up(i).z = normals[cur_curves[i]][Math.round(temp_t * cur_curveSegments)].z;
        }
    }

    // switching curve when t approaches to 1
    if (t >= 0.987 && !switched) {
        switch_curve = true;
        next_curve += 1;
        if (next_curve == CPlist.length) {
            next_curve = 0;
        }
    }
    if (switch_curve) {
        cur_curve = next_curve;
        switched = true;
        switch_curve = false;
    }
    if (t < 0.1) {
        switched = false;
    }

    //camera
    if (params.TrainView == true) {
        myWorld.controls.enabled = false;
        myWorld.renderwithCamera(train.camera);
    } else {
        myWorld.render();
    }

    //update
    myWorld.controls.update();
    for (var i = 0; i < CPlist.length; i++) {
        CPlist[i].animate();
    }
    if (params.Run) {
        time += time_increments[cur_curve];
    }
}