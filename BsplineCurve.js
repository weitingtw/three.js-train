/*
 An example of a self-defined curve in three.js. In this case, it
 is a B-spline curve.

 For creating a Three.Curve object, a constructor has to be defined.
 A getPoint method is also required, in which it takes an argument 
 that ranges from 0 to 1, which speicifies the position of a point on
 the curve through time. Optionally, a getTangent method can be defined.
 */

function BsplineCurve(CP1, CP2, CP3, CP4) {
    THREE.Curve.call(this);
    this.point1 = CP1;
    this.point2 = CP2;
    this.point3 = CP3;
    this.point4 = CP4;
}

BsplineCurve.prototype = Object.create(THREE.Curve.prototype);
BsplineCurve.prototype.constructor = BsplineCurve;

BsplineCurve.prototype.getPoint = function (t) {

    var p0 = [this.point1.position().x, this.point1.position().y, this.point1.position().z];
    var p1 = [this.point2.position().x, this.point2.position().y, this.point2.position().z];
    var p2 = [this.point3.position().x, this.point3.position().y, this.point3.position().z];
    var p3 = [this.point4.position().x, this.point4.position().y, this.point4.position().z];

    // derived from the basis matrix of b-spline
    var b0 = (-t * t * t + 3 * t * t - 3 * t + 1) / 6;
    var b1 = (3 * t * t * t - 6 * t * t + 4) / 6;
    var b2 = (-3 * t * t * t + 3 * t * t + 3 * t + 1) / 6;
    var b3 = (t * t * t) / 6;


    var result = [p0[0] * b0 + p1[0] * b1 + p2[0] * b2 + p3[0] * b3,
        p0[1] * b0 + p1[1] * b1 + p2[1] * b2 + p3[1] * b3,
        p0[2] * b0 + p1[2] * b1 + p2[2] * b2 + p3[2] * b3
    ];


    return new THREE.Vector3(result[0], result[1], result[2]);

};