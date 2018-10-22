/*
 An implementation of the a World, which takes a Canvas ID as the argument. 
 use World.addObject()/removeObject() to add/remove objects to the scene
 The THREE.TrackballControls is provided by Three.js in its examples.
 */

class World {

    /**
     * Create a Train.
     * @param {string} canvasId - The canvasId where the world is rendered in.
     */
    constructor(canvasId) {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById(canvasId),
            antialias: true
        });
        this.renderer.setClearColor(0xfff1ff);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(document.getElementById(canvasId).width, document.getElementById(canvasId).height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        this.camera = new THREE.PerspectiveCamera(50, document.getElementById(canvasId).width / document.getElementById(canvasId).height, 0.01, 3000);
        this.camera.position.x = 200;
        this.camera.position.z = 0;
        this.camera.position.y = 400;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene = new THREE.Scene();

        // add fog effect
        var fogColor = new THREE.Color(0xffffff);
        this.scene.background = fogColor;
        this.scene.fog = new THREE.Fog(fogColor, 0.0025, 650);

        // Provided trackball Controls in Three.js examples
        this.controls = new THREE.TrackballControls(this.camera);
        this.controls.rotateSpeed = 3.0;
        this.controls.panSpeed = 2.0;

        // the trackball controls are only enabled when the mouse is over 
        document.getElementById(canvasId).onmouseover = () => {
            this.controls.enabled = true;
        };
        document.getElementById(canvasId).onmouseout = () => {
            this.controls.enabled = false;
        };
    }
    /**  
     * takes a THREE.js Mesh as the argument and add it to this world
     * @param {object} object a three.js mesh
     **/
    addObject(object) {
        this.scene.add(object);
    }

    /**  
     * takes a THREE.js Mesh as the argument and remove it from this world
     * @param {object} object a three.js mesh
     **/
    removeObject(object) {
        this.scene.remove(object);
    }

    /**  
     * render the world with a alternative camera
     * @param {object} camera a three.js camera
     **/
    renderwithCamera(camera) {
        this.renderer.render(this.scene, camera);
    }

    /**  
     * render the canvas
     **/
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}