/*
    The file contains helper functions used in the "main.js" file.
*/

// Computer the normals at points on curves based on the number of curve segments
function computeNormals(cur_curveSegments) {
  normals = [];
  for (var i = 0; i < CPlist.length; i++) {
    var a = i;
    var b = i + 1 >= CPlist.length ? 0 : i + 1;
    var cur_normals = [];
    for (var j = 0; j < cur_curveSegments; j++) {
      var normal = new THREE.Vector3();
      normal.lerpVectors(
        CPlist[a].orient,
        CPlist[b].orient,
        j * (1 / cur_curveSegments)
      );
      cur_normals.push(normal);
    }
    var normal = new THREE.Vector3();
    normal.lerpVectors(CPlist[a].orient, CPlist[b].orient, 1);
    cur_normals.push(normal);
    normals.push(cur_normals);
  }
}

// computer the time to increment for each curve every time render() is called in main.js
// If ArcLength parameterization, then the time to increment is based on
// the length of the curve
function computerTimeIncrements() {
  time_increments = [];
  for (var i = 0; i < curves.length; i++) {
    if (params.ArcLength) {
      time_increments.push(
        Math.round((params.Speed / curves[i].getLength()) * 200)
      );
    } else {
      time_increments.push(params.Speed);
    }
  }
}

// Function to call when control points are being dragged
function dragStartCallBack(event) {
  Color = event.object.material.color.getHex();
  myWorld.controls.enabled = false;
  event.object.material.color.setHex(0xff0000);
  params.realTime = true;
  for (var i = 0; i < CPlist.length; i++) {
    if (CPlist[i].mesh == event.object) {
      if (!params.Bspline) {
        chosenCP = CPlist[i];
      } else {
        chosenCP = i == 0 ? CPlist.length - 1 : CPlist[i - 1];
      }
    } else {
      CPlist[i].mesh.material.color.setHex(0x0000ff);
    }
  }
}

// function to call when control points finish dragging
function dragEndCallBack(event) {
  myWorld.controls.enabled = true;
  //params.realTime = false;
}

// add a control point to a world
function addPoint(world) {
  var newpointx =
    (CPlist[0].position().x + CPlist[CPlist.length - 1].position().x) / 2;
  var newpointy =
    (CPlist[0].position().y + CPlist[CPlist.length - 1].position().y) / 2;
  var newpointz =
    (CPlist[0].position().z + CPlist[CPlist.length - 1].position().z) / 2;
  var newpoint = new ControlPoint(newpointx, newpointy, newpointz, world);
}

// remove a control point from a world
function removePoint(world) {
  if (params.realTime) {
    if (CPlist.length >= 4) {
      world.removeObject(CPlist[CPlist.length - 1].mesh);
      CPlist.pop();
      CPlist_positions.pop();
    }
  }
}

// remove all points from a world
function removeAllPoints(world) {
  var length = CPlist.length;
  for (var i = 0; i < length; i++) {
    world.removeObject(CPlist[CPlist.length - 1].mesh);
    CPlist.pop();
    CPlist_positions.pop();
  }
}

// draw the curve based on the number of curve Segments
function drawCurves(cur_curveSegments) {
  for (var i = 0; i < curvesMeshes.length; i++) {
    myWorld.scene.remove(curvesMeshes[i]);
    curvesMeshes[i].geometry.dispose();
    curvesMeshes[i].material.dispose();
  }
  var material = new THREE.MeshBasicMaterial({
    color: 0x000000
  });

  // clear lists of curve meshes and curves
  curvesMeshes = [];
  curves = [];

  for (var i = 0; i < CPlist.length; i++) {
    // four adjacent indices in order
    var a = i;
    var b = i + 1 >= CPlist.length ? i + 1 - CPlist.length : i + 1;
    var c = i + 2 >= CPlist.length ? i + 2 - CPlist.length : i + 2;
    var d = i + 3 >= CPlist.length ? i + 3 - CPlist.length : i + 3;
    var controlpoint = new THREE.Vector3(
      CPlist[a].position().x + CPlist[b].position().x,
      CPlist[a].position().y + CPlist[b].position().y,
      CPlist[a].position().z + CPlist[b].position().z
    );
    var curve;
    curve = new LinearCurve(CPlist[a], CPlist[b]);
    if (params.Bspline) {
      curve = new BsplineCurve(CPlist[a], CPlist[b], CPlist[c], CPlist[d]);
    }
    var geometry = new THREE.TubeGeometry(
      curve,
      cur_curveSegments,
      0.5,
      4,
      false
    );
    var curveObject = new THREE.Mesh(geometry, material);

    myWorld.addObject(curveObject);
    curvesMeshes.push(curveObject);
    curves.push(curve);
  }
}

// create texture for rail ties
var loader = new THREE.TextureLoader();
loader.setCrossOrigin("anonymous");
var texture = loader.load("images/wood.jpeg");

// draw rail ties based on the number of curve segments
function drawRail(cur_curveSegments) {
  var material = new THREE.MeshBasicMaterial({
    map: texture
  });
  var geometry = new THREE.BoxGeometry(20, 1, 5, 1, 1, 1);
  // remove previously drawn rail ties
  for (var i = 0; i < rails.length; i++) {
    myWorld.scene.remove(rails[i]);
    rails[i].geometry.dispose();
    rails[i].material.dispose();
  }

  // store rail ties meshes
  rails = [];

  for (var i = 0; i < CPlist.length; i++) {
    for (var j = 0; j < cur_curveSegments; j++) {
      var rail = new THREE.Mesh(geometry, material);
      // position
      rail.position.x = curves[i].getPoint((1 / cur_curveSegments) * j).x;
      rail.position.y = curves[i].getPoint((1 / cur_curveSegments) * j).y;
      rail.position.z = curves[i].getPoint((1 / cur_curveSegments) * j).z;
      // orientation
      rail.up.x = normals[i][j].x;
      rail.up.y = normals[i][j].y;
      rail.up.z = normals[i][j].z;
      rail.lookAt(curves[i].getPoint((1 / cur_curveSegments) * (j + 1)));
      rail.receiveShadow = true;
      myWorld.addObject(rail);
      rails.push(rail);
    }
  }
}

// set up the UI
function setupUI() {
  const gui = new dat.GUI();
  f1 = gui.addFolder("View");
  f2 = gui.addFolder("Animation");
  controllers = [];

  // view Folder
  f1.add(params, "ArcBallView")
    .onChange(function(value) {
      if (value == true) {
        params.TopView = false;
        params.TrainView = false;
        myWorld.controls.reset();
        myWorld.camera.up.set(0, 1, 0);
        myWorld.controls.target = new THREE.Vector3(0, 0, 0);
        myWorld.controls.noRotate = false;
        myWorld.camera.position.x = 200;
        myWorld.camera.position.z = 0;
        myWorld.camera.position.y = 400;
      }
    })
    .listen()
    .onFinishChange();
  f1.add(params, "TopView")
    .onChange(function(value) {
      if (value == true) {
        params.ArcBallView = false;
        params.TrainView = false;
        myWorld.controls.target = new THREE.Vector3(0, 0, 0);
        myWorld.camera.up.set(0, 1, 0);
        myWorld.controls.reset();
        myWorld.controls.noRotate = true;
        myWorld.camera.position.x = 0;
      }
    })
    .listen()
    .onFinishChange();
  f1.add(params, "TrainView")
    .onChange(function(value) {
      if (value == true) {
        params.TopView = false;
        params.ArcBallView = false;
      }
    })
    .listen()
    .onFinishChange();

  // Animation folder
  f2.add(params, "ArcLength");
  f2.add(params, "Speed", 10, 30);
  f2.add(params, "Run");
  f2.add(params, "CurveSegments", 10, 40);
  controllers[0] = f2
    .add(params, "Bspline")
    .listen()
    .onFinishChange();
  controllers[1] = f2
    .add(params, "realTime")
    .listen()
    .onFinishChange();
  //set realTime and B spline to false when initialized
  params["realTime"] = false;
  params["Bspline"] = false;
  f2.add(params, "addFog").name("add fog effect");
  f2.add(params, "addPoint").name("add a Point");
  f2.add(params, "removePoint").name("remove a Point");
  f2.add(params, "addCar").name("add a Car");
  f2.add(params, "removeCar").name("remove a Car");
  f2.add(params, "loadPoints").name("Load Point File");
}

// set up for loading file content of control points
function setUpreload(world) {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var fileSelected = document.getElementById("txtfiletoread");
    fileSelected.addEventListener(
      "change",
      function(e) {
        //Get the file object
        var fileTobeRead = fileSelected.files[0];
        //Initialize the FileReader object to read the 2file
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
          var result = fileReader.result.split(/\s+/);
          if (result.length % 6 != 0 || result.length < 18) {
            console.log(result);
            alert("Wrong data format or too few data entries");
          }
          // re-setup the world
          world.renderer.setAnimationLoop(null);
          removeAllPoints(world);

          // add points
          for (var i = 0; i < result.length / 6; i++) {
            var new_point = new ControlPoint(
              parseInt(result[i * 6]),
              parseInt(result[i * 6 + 1]),
              parseInt(result[i * 6 + 2]),
              world
            );
            new_point.setOrient(
              parseInt(result[i * 6 + 3]),
              parseInt(result[i * 6 + 4]),
              parseInt(result[i * 6 + 5])
            );
            world.addObject(new_point.mesh);
            console.log(new_point);
          }

          // initial calculations
          drawCurves(params.CurveSegments);
          computeNormals(params.CurveSegments);
          computerTimeIncrements();
          drawRail(params.CurveSegments);
          world.renderer.setAnimationLoop(render);
        };
        fileReader.readAsText(fileTobeRead);
      },
      false
    );
  } else {
    alert("Files are not supported");
  }
}

// manipulate orientation of the control points
document.onkeypress = function(event) {
  if (chosenCP != null && (event.key == "q" || event.key == "Q")) {
    console.log(chosenCP, "asd");
    chosenCP.orient.x += 0.15;
  }
  if (chosenCP != null && (event.key == "w" || event.key == "W")) {
    chosenCP.orient.x -= 0.15;
  }
  if (chosenCP != null && (event.key == "e" || event.key == "E")) {
    chosenCP.orient.z += 0.15;
  }
  if (chosenCP != null && (event.key == "r" || event.key == "R")) {
    chosenCP.orient.z -= 0.15;
  }
};
