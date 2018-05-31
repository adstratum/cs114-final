class Rotation {
    /**
     * Represents a rotation in axis-angle form.
     * 
     * @param {float} rotateDeg 
     * @param {vec3} rotateAxis 
     */
    constructor(rotateDeg, rotateAxis) {
        var rotateRad = glMatrix.toRadian(rotateDeg);
        this.quat = quat.create();
        quat.setAxisAngle(this.quat, rotateAxis, rotateRad);
    }

    getQuat() {
        return this.quat;
    }

    toString() {
        return this.quat.toString();
    }
}

class Transform {
    /**
     * named-argument version of constructor, specifying
     * @param {vec3} translate, default = [0, 0, 0]
     * @param {float} rotateDeg, default = 0
     * @param {vec3} rotateAxis, default = [0, 0, 0]
     * @param {vec3} scale, default = [1, 1, 1];
     */
    constructor(kargs) {
        console.log(kargs);
        this.translate = vec3.fromValues(0, 0, 0);
        this.rotate = new Rotation(0, vec3.fromValues(0, 0, 0));
        this.scale = vec3.fromValues(1, 1, 1);
        if (kargs) {
            if ('translate' in kargs)
                this.translate = kargs.translate;
            if ('rotateDeg' in kargs && 'rotateAxis' in kargs)
                this.rotate = new Rotation(kargs.rotateDeg, vec3.normalize(kargs.rotateAxis,kargs.rotateAxis));
            if ('scale' in kargs)
                this.scale = kargs.scale;
        }
    }

    /**
     * Get the 4x4 transform matrix formed from the individual translation, rotation, and scaling.
     */
    getTransformMatrix() {
        var result = mat4.create();
        mat4.fromRotationTranslationScale(
            result, 
            this.rotate.getQuat(), 
            this.translate, 
            this.scale);
        return result;
    }

    /**
     * Get a 4x4 transform matrix without the scaling factor, which
     * is useful when trying to compute a 
     * transform relative to another object.
     */
    getScalelessTransform() {
        var result = mat4.create();
        mat4.fromRotationTranslation(result,
            this.rotate.getQuat(),
            this.translate);
        return result;
    }

    /**
     * 
     * @param {Transform} other 
     */
    mulTransform(other) {
        var result = mat4.create();
        mat4.multiply(result, other.getScalelessTransform(), this.getTransformMatrix());
        return result;
    }

    toString() {
        return "tr: " + this.translate + " rot: " + this.rotate + " scl: " + this.scale;
    }
}

DrawMode = {FLAT:1, PHONG:2, UVS:3}

class Material {
    /**
     * Encapsulates the diffuse and specular properties of a model.
     * 
     * @param {vec4} diffuseColor 
     * @param {vec4} specularColor 
     * @param {float} specularExponent 
     * @param {int} drawMode
     */
    constructor(diffuseColor, specularColor, specularExponent, drawMode) {
        this.diffuseColor = (typeof diffuseColor == 'undefined') ? vec4.fromValues(1, 1, 1, 1) : diffuseColor;
        this.specularColor = (typeof specularColor == 'undefined') ? vec4.fromValues(1, 1, 1, 1) : specularColor;
        this.specularExponent = (typeof specularExponent == 'undefined') ? 10 : specularExponent;
        this.drawMode = (typeof drawMode == 'undefined') ? DrawMode.PHONG : drawMode;
    }
}

class Node{
    /**
     * Creates a Node object that contains a transform matrix and information about its nodeParent and children.
     * Additionally, the object may be animated through a second Transform object, representing a change in translation, rotation, and scale.
     * 
     * @param {String} name 
     * @param {Transform} transform 
     * @param {Transform} animate 
     * @param {Node} nodeParent 
     */
    constructor(name, transform, animate, nodeParent) {
        this.name = name;
        if (transform) {
            this.transform = transform;
        } else {
            this.transform = new Transform();
        }
        if (animate) {
            this.animateM = animate;
            this.hasAnimation = true;
        }
        if (nodeParent)
            nodeParent.setChild(this);
        this.nodeChildren = [];
    }

    animate(delta) {
        vec3.scaleAndAdd(this.transform.translate, this.transform.translate, this.animateM.translate, delta);
        var dquat = quat.create();
        quat.scale(dquat, this.animateM.rotate.quat, delta);
        quat.multiply(this.transform.rotate.quat, this.transform.rotate.quat, dquat);
        quat.normalize(this.transform.rotate.quat, this.transform.rotate.quat);
        vec3.scaleAndAdd(this.transform.scale, this.transform.scale, this.animateM.scale, delta);
    }

    getLocalTransform() {
        return this.transform.getTransformMatrix();
    }

    getScalelessTransform() {
        return this.transform.getScalelessTransform();
    }


    getWorldSpaceTransform() {
        if (this.nodeParent && "transform" in this.nodeParent) {
            var tmp = mat4.create();
            return mat4.multiply(tmp, 
                this.nodeParent.getWorldSpaceTransform(), this.getScalelessTransform());
        } else {
            return this.getScalelessTransform();
        }
    }

    setParent(nodeParent) {
        if (nodeParent)
            nodeParent.children.push(this);
        this.nodeParent = nodeParent;
    }

    setChild(node) {
        if (node) 
            this.nodeChildren.push(node);
        node.nodeParent = this;
    }

    toString() {
        var ostr = "";
        ostr += "name: " + this.name + "\n";
        ostr += "transform: " + this.transform.toString() + "\n\n";

        for (var child of this.nodeChildren)
            ostr += child.toString();
        return ostr;
    }
}

class Model extends Node {
    /**
     * A Node with a mesh and Material attached.
     * 
     * @param {String} name 
     * @param {*} mesh 
     * @param {Material} material 
     * @param {Transform} transform 
     * @param {Transform} animate 
     * @param {Node} nodeParent 
     */
    constructor(name, mesh, material, transform, animate, nodeParent) {
        super(name, transform, animate, nodeParent);
        this.mesh = mesh;
        this.material = material;
    }
}

var dMat = new Material([1,1,1,1], [1,1,1,1], 10);
var nullT = new Transform({translate: [0, 0, 0], rotateDeg : 0, rotateAxis : [0,0,1]});
var nullAnim = new Transform({rotateDeg:0, rotateAxis: [0, 0, 0], scale: [0, 0, 0]});


class Tree extends Node {
    /**
     * Template for a new Tree, oriented with respect to y-up.
     * 
     * @param {*} name 
     * @param {*} transform 
     * @param {*} animate 
     * @param {*} nodeParent 
     */
    constructor(name, transform, animate, nodeParent) {
        super(name, transform, animate, nodeParent);
        this.inheritScale = true;
        
        var trm = new Material([.55, .27, .07, 1]);
        var brm = new Material([0, .5, .0, 1]);
        var trt = new Transform({translate: [0, 0, 0], rotateDeg: -90, rotateAxis: [1,0,0], scale: [.5, .5, 1]});
        var brt = new Transform({translate: [0, 1, 0], rotateDeg: -90, rotateAxis: [1,0,0], scale: [1, 1, 1]});

        this.tr = new Model(name + " trunk", uvCylinder(), trm, trt, nullAnim, this);
        this.br = new Model(name + " branches", uvCone(), brm, brt, nullAnim, this);
    }
}

class Wheel extends Node {
    /**
     * Creates a wheel with six cylindrical spokes arranged inside of a torus. 
     * 
     * @param {*} name 
     * @param {*} transform 
     * @param {*} animate 
     * @param {*} nodeParent 
     */
    constructor(name, transform, animate, nodeParent) {
        super(name, transform, animate, nodeParent);

        var radConst = (360/6) * (Math.PI / 180);
        this.inheritScale = true;

        var tireMat = new Material([.2, .2, .2, 1]);
        var structMat = new Material([.5, .5, .5, 1]);

        this.tire = new Model(name + " tire", uvTorus(2, 1), tireMat, new Transform(), nullAnim, this);
        this.spokes = [];
        for (var i = 0; i < 6; ++i) {
            this.spokes.push(
                new Model(
                    name + " spoke " + i, uvCylinder(), structMat, 
                    new Transform({
                        translate: [Math.sin(radConst * i) / 2, Math.cos(radConst * i) / 2, 0], 
                        rotateDeg: 90, 
                        rotateAxis: [-Math.cos(radConst * i), Math.sin(radConst * i),0], 
                        scale: [.5,.5,2]
                    }), 
                    nullAnim, this
                )
            );
        }
        this.axle = new Model(name + " axle", uvCylinder(), structMat, new Transform({translate: [0, 0, -.5], scale: [.5,.5,1]}), nullAnim, this);
    }
}

class Car extends Node {
    constructor (name, transform, animate, nodeParent) {
        super(name, transform, animate, nodeParent);

        this.wheelSpeed = 3;
        var bodyMat = new Material([.7, 0, 0, 1]);
        var headMat = new Material([.8, .8, 0, 1]);

        this.body = new Model(name + " body", cube(), bodyMat, new Transform({scale: [2, 0.5, 1]}), nullAnim, this);
        this.upper = new Model(name + " upper", cube(), bodyMat, new Transform({translate: [0, .5, 0], scale: [1, 0.5, 1]}), nullAnim, this);
        this.frontRight = new Wheel(
            name + " fr wheel", new Transform({translate: [.8, -.2, .6], scale: [0.2, 0.2, 0.2]}), 
            new Transform({rotateDeg: this.wheelSpeed, rotateAxis: [0, 0, -1], scale: [0, 0, 0]}), this);
        this.frontLeft = new Wheel(
            name + " fl wheel", new Transform({translate: [.8, -.2, -.6], rotateDeg: 180, rotateAxis: [1, 0, 0], scale: [0.2, 0.2, 0.2]}), 
            new Transform({rotateDeg: this.wheelSpeed, rotateAxis: [0, 0, 1], scale: [0, 0, 0]}), this);
        this.backRight = new Wheel(
            name + " fr wheel", new Transform({translate: [-.8, -.2, .6], scale: [0.2, 0.2, 0.2]}), 
            new Transform({rotateDeg: this.wheelSpeed, rotateAxis: [0, 0, -1], scale: [0, 0, 0]}), this);
        this.backLeft = new Wheel(
            name + " fl wheel", new Transform({translate: [-.8, -.2, -.6], rotateDeg: 180, rotateAxis: [1, 0, 0], scale: [0.2, 0.2, 0.2]}), 
            new Transform({rotateDeg: this.wheelSpeed, rotateAxis: [0, 0, 1], scale: [0, 0, 0]}), this);
        this.headRight = new Model (name + " r headlight", uvSphere(), headMat, new Transform({translate:[1, 0, .3], scale: [.2, .2, .2]}), nullAnim, this);
        this.headLeft = new Model (name + " r headlight", uvSphere(), headMat, new Transform({translate:[1, 0, -.3], scale: [.2, .2, .2]}), nullAnim, this);
    }
}

class Light extends Node {
    constructor(name, transform, animate, nodeParent, kargs) {
        super(name, transform, animate, nodeParent);
        if (kargs) {
            if ('type' in kargs)
                if (kargs.type == "point") {
                    this.type = kargs.type;
                    this.atten = kargs.atten;
                }
                if (kargs.type == "spot"){
                    this.type = kargs.type;
                    this.atten = kargs.atten;
                    this.spotDir = kargs.spotDir;
                    this.spotAngle = kargs.spotAngle;
                }
                this.enable = 1.0;
        }
        this.lightTarget = new Node(name + " target", new Transform({translate: [1, 0, 0]}), nullAnim, this);
    }
}