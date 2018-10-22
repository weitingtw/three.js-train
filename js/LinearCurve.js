/*
 An example of a self-defined curve in three.js. In this case, it
 is a linear curve.

 For creating a Three.Curve object, a constructor has to be defined.
 A getPoint method is also required, in which it takes an argument 
 that ranges from 0 to 1, which speicifies the position of a point on
 the curve through time. Optionally, a getTangent method can be defined.
 */

function LinearCurve(CP1, CP2) {
    THREE.Curve.call(this);
    this.point1 = CP1;
    this.point2 = CP2;
}

LinearCurve.prototype = Object.create(THREE.Curve.prototype);
LinearCurve.prototype.constructor = LinearCurve;

LinearCurve.prototype.getPoint = function (t) {
    var p0 = [this.point1.position().x, this.point1.position().y, this.point1.position().z];
    var p1 = [this.point2.position().x, this.point2.position().y, this.point2.position().z];
    var result = [p0[0] + (p1[0] - p0[0]) * t,
        p0[1] + (p1[1] - p0[1]) * t,
        p0[2] + (p1[2] - p0[2]) * t
    ];
    return new THREE.Vector3(result[0], result[1], result[2]);

};