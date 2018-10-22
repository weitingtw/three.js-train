/*
 An implementation of the ControlPoint class that serves as a parameter 
 for creating curvies.
 */

// a global list of draggable Objects, passed as a parameter in THREE.DragControls()
var draggableObjects = [];

// a global list of the meshes of all control points
var CPlist = [];

// a global list of the positions of all control points
var CPlist_positions = [];

class ControlPoint {
    constructor(x, y, z, world) {
        var CPgeometry = new THREE.BoxGeometry(10, 10, 10, 1, 1, 1);
        var CPmaterial = new THREE.MeshPhongMaterial({
            color: 0x0000ff
        });
        this.mesh = new THREE.Mesh(CPgeometry, CPmaterial);
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
        this.orient = new THREE.Vector3(0, 1, 0);

        world.addObject(this.mesh);
        draggableObjects.push(this.mesh);
        CPlist.push(this);
        CPlist_positions.push(this.position());
    }
    position() {
        return this.mesh.position;
    }

    setOrient(x, y, z) {
        this.orient = new THREE.Vector3(x, y, z);
    }
    animate() {
        this.mesh.rotation.y += 0.1;
    }
}