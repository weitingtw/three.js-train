/*
 An implementation of the Train class, which takes a World and a Canvas ID 
 as the argument. 
 */

class Train {
  /**
   * Create a Train.
   * @param {World} world - The world the train is in.
   * @param {string} canvasId - The canvasId where the world is rendered in.
   */
  constructor(world, canvasId) {
    this.world = world;
    // the camera that follows the train
    this.camera = new THREE.PerspectiveCamera(
      50,
      document.getElementById(canvasId).width /
        document.getElementById(canvasId).height,
      0.01,
      3000
    );
    this.camera.position.y = 30;
    this.camera.rotation.y = Math.PI;

    // Create the head car for the train
    var boxGeometry = new THREE.BoxGeometry(15, 15, 40, 1, 1, 1);
    var textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("");
    var trainTexture = new textureLoader.load("images/metal.png");
    console.log(trainTexture);

    this.material = new THREE.MeshPhongMaterial({
      color: 0xf0ff0f,
      map: trainTexture
    });
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    boxMesh.position.y = 10;

    var headGeometry = new THREE.BoxGeometry(15, 10, 5, 1, 1, 1);
    var headMaterial = new THREE.MeshBasicMaterial({
      color: 0xfff0f0
    });
    var headMesh = new THREE.Mesh(headGeometry, headMaterial);
    headMesh.position.y = 18;
    headMesh.position.z = 10;

    var wheelGeometry = new THREE.CylinderGeometry(5, 5, 5, 12);
    var wheelMesh1 = new THREE.Mesh(wheelGeometry, material);
    wheelMesh1.position.x = 6;
    wheelMesh1.position.y = 5;
    wheelMesh1.position.z = 8;
    wheelMesh1.rotation.z = Math.PI / 2;

    var wheelMesh2 = new THREE.Mesh(wheelGeometry, material);
    wheelMesh2.position.x = -6;
    wheelMesh2.position.y = 5;
    wheelMesh2.position.z = 8;
    wheelMesh2.rotation.z = Math.PI / 2;

    var wheelMesh3 = new THREE.Mesh(wheelGeometry, material);
    wheelMesh3.position.x = -6;
    wheelMesh3.position.y = 5;
    wheelMesh3.position.z = -8;
    wheelMesh3.rotation.z = Math.PI / 2;

    var wheelMesh4 = new THREE.Mesh(wheelGeometry, material);
    wheelMesh4.position.x = 6;
    wheelMesh4.position.y = 5;
    wheelMesh4.position.z = -8;
    wheelMesh4.rotation.z = Math.PI / 2;

    // combine all the meshes into one geometry
    var singleGeometry = new THREE.Geometry();
    boxMesh.updateMatrix();
    singleGeometry.merge(boxMesh.geometry, boxMesh.matrix);
    headMesh.updateMatrix();
    singleGeometry.merge(headMesh.geometry, headMesh.matrix);
    wheelMesh1.updateMatrix();
    singleGeometry.merge(wheelMesh1.geometry, wheelMesh1.matrix);
    wheelMesh2.updateMatrix();
    singleGeometry.merge(wheelMesh2.geometry, wheelMesh2.matrix);
    wheelMesh3.updateMatrix();
    singleGeometry.merge(wheelMesh3.geometry, wheelMesh3.matrix);
    wheelMesh4.updateMatrix();
    singleGeometry.merge(wheelMesh4.geometry, wheelMesh4.matrix);

    this.meshes = [];
    var singleMesh = new THREE.Mesh(singleGeometry, this.material);
    singleMesh.add(this.camera);
    this.meshes.push(singleMesh);
    world.addObject(singleMesh);
  }

  /**
   * Get the position of the mesh of the car based on input index.
   * @param {number} index the input index
   * @param {object} position the position at which the mesh to look
   */
  lookAt(index, position) {
    this.meshes[index].lookAt(position);
  }

  /**
   * Get the position of the mesh of the car based on input index.
   * @param {number} index the input index
   * @return the position of the mesh.
   */
  position(index) {
    return this.meshes[index].position;
  }

  /**
   * Get the up vector of the mesh of the car based on input index.
   * @param {number} index the input index
   * @return the up vector of the mesh.
   */
  up(index) {
    return this.meshes[index].up;
  }

  /**
   * Add a car to the end of the current train
   */
  addCar() {
    // body
    var boxGeometry = new THREE.BoxGeometry(15, 15, 30, 1, 1, 1);
    var material = new THREE.MeshPhongMaterial({
      color: 0x00f0ff
    });
    var boxMesh = new THREE.Mesh(boxGeometry, this.material);
    boxMesh.position.y = 10;
    var headGeometry = new THREE.BoxGeometry(5, 5, 15, 1, 1, 1);
    var headMaterial = new THREE.MeshPhongMaterial({
      color: 0xff00f0
    });

    // wheels
    var wheelGeometry = new THREE.CylinderGeometry(5, 5, 5, 12);
    var wheelMesh1 = new THREE.Mesh(wheelGeometry, this.material);
    wheelMesh1.position.x = 6;
    wheelMesh1.position.y = 5;
    wheelMesh1.position.z = 8;
    wheelMesh1.rotation.z = Math.PI / 2;

    var wheelMesh2 = new THREE.Mesh(wheelGeometry, this.material);
    wheelMesh2.position.x = -6;
    wheelMesh2.position.y = 5;
    wheelMesh2.position.z = 8;
    wheelMesh2.rotation.z = Math.PI / 2;

    var wheelMesh3 = new THREE.Mesh(wheelGeometry, this.material);
    wheelMesh3.position.x = -6;
    wheelMesh3.position.y = 5;
    wheelMesh3.position.z = -8;
    wheelMesh3.rotation.z = Math.PI / 2;

    var wheelMesh4 = new THREE.Mesh(wheelGeometry, this.material);
    wheelMesh4.position.x = 6;
    wheelMesh4.position.y = 5;
    wheelMesh4.position.z = -8;
    wheelMesh4.rotation.z = Math.PI / 2;

    var singleGeometry = new THREE.Geometry();
    var singleMesh = new THREE.Mesh(singleGeometry, this.material);
    boxMesh.updateMatrix();
    singleGeometry.merge(boxMesh.geometry, boxMesh.matrix);
    wheelMesh1.updateMatrix();
    singleGeometry.merge(wheelMesh1.geometry, wheelMesh1.matrix);
    wheelMesh2.updateMatrix();
    singleGeometry.merge(wheelMesh2.geometry, wheelMesh2.matrix);
    wheelMesh3.updateMatrix();
    singleGeometry.merge(wheelMesh3.geometry, wheelMesh3.matrix);
    wheelMesh4.updateMatrix();
    singleGeometry.merge(wheelMesh4.geometry, wheelMesh4.matrix);

    this.meshes.push(singleMesh);
    this.world.addObject(singleMesh);
  }

  /**
   * Remove a car from the end of the current train
   */
  removeCar() {
    if (this.meshes.length > 1) {
      this.world.removeObject(this.meshes[this.meshes.length - 1]);
      this.meshes.pop();
    }
  }
}
