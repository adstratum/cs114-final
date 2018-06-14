DrawMode = {FLAT:1, PHONG:2, UVS:3, TEXTURED_FLAT:4, TEXTURED_PHONG:5, POINT_TEXTURED:6}

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

    setRotationFromEuler(x, y, z) {
        quat.fromEuler(this.quat, x, y, z);
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

class Material {
    
    /** named-argument version of constructor, specifying
     * @param {vec4} diffuseColor 
     * @param {vec4} specularColor 
     * @param {float} specularExponent 
     * @param {enum} drawMode
     * @param {int} textureID
    */
    constructor(kargs) {
        this.diffuseColor = vec4.fromValues(1, 1, 1, 1);
        this.specularColor = vec4.fromValues(1, 1, 1, 1);
        this.specularExponent = 10;
        this.drawMode = DrawMode.PHONG;
        this.texture = null;
        if (kargs) {
            if ('diffuseColor' in kargs)
                this.diffuseColor = kargs.diffuseColor;
            if ('specularColor' in kargs)
                this.specularColor = kargs.specularColor;
            if ('specularExponent' in kargs)
                this.specularExponent = kargs.specularExponent;
            if ('drawMode' in kargs)
                this.drawMode = kargs.drawMode;
            if ('textureID' in kargs) {
                this.textureID = kargs.textureID;
            }
        }
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

    /**
     * Binds this Model's mesh data to the given WebGL context.
     * 
     * @param {*} gl 
     */
    fillBuffers(gl) {
        this.mesh.coordsBuffer = gl.createBuffer();
        this.mesh.normalBuffer = gl.createBuffer();
        this.mesh.indexBuffer = gl.createBuffer();
        this.mesh.texcoordsBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.coordsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.mesh.vertexPositions, gl.STATIC_DRAW);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.mesh.vertexNormals, gl.STATIC_DRAW);
    
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.mesh.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indices, gl.STATIC_DRAW);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.texcoordsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.mesh.vertexTextureCoords, gl.STATIC_DRAW);
    }
}

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
        
        var trm = new Material({diffuseColor: [.55, .27, .07, 1]});
        var brm = new Material({diffuseColor: [0, .5, .0, 1]});
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

        var tireMat = new Material({diffuseColor: [.2, .2, .2, 1]});
        var structMat = new Material({diffuseColor: [.5, .5, .5, 1]});

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
        var bodyMat = new Material({diffuseColor: [.7, 0, 0, 1]});
        var headMat = new Material({diffuseColor: [.8, .8, 0, 1]});

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

function rRng(scale) {
    return ((scale * 2) * Math.random()) - scale;
}

class ParticleSet extends Node {
    constructor(name, material, transform, animate, nodeParent) {
        super(name, transform, animate, nodeParent);
        this.material = material;
        if (!(material.drawMode == DrawMode.FLAT || material.drawMode == DrawMode.POINT_TEXTURED) ) {
            this.material.drawMode = DrawMode.FLAT;
        }
        this.vertexCount = 100;
        this.vertexArray = new Float32Array(this.vertexCount*3);
        this.vertexProperties = {};
        this.counter=0;
        for (var vert = 0; vert < this.vertexCount; ++vert) {
            this.setPosition(vert, [rRng(3), rRng(3), rRng(3)]);
        }
    }

    fillBuffers(gl) {
        this.coordsBuffer = gl.createBuffer();
        this.updateBuffers(gl);
    }

    updateBuffers(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexArray, gl.DYNAMIC_DRAW);
    }

    animate(gl, delta) {
        for (var i = 0; i < this.vertexCount; ++i) {
            var motion = vec3.fromValues(rRng(0.1), rRng(0.1), rRng(0.1));
            vec3.scale(motion, motion, delta);
            var position = this.getPosition(i);
            vec3.add(position, position, motion);
            this.setPosition(i, position);
        }

        this.updateBuffers(gl);
    }

    getPosition(i) {
        return vec3.fromValues(this.vertexArray[3*i], this.vertexArray[3*i + 1], this.vertexArray[3*i + 2]);
    }

    setPosition(i, vec) {
        this.vertexArray[3*i] = vec[0]; this.vertexArray[3*i + 1] = vec[1]; this.vertexArray[3*i + 2] = vec[2];
    }

    getProperties(i) {
        return this.vertexProperties[i];
    }

    setProperties(i, dict) {
        this.vertexProperties[i] = dict;
    }
}