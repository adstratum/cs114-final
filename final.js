"use strict";

var gl;   // The webgl context.

var a_coords_loc;       // Location of the a_coords attribute variable in the shader program.
var a_normal_loc;       // Location of a_normal attribute.
var a_texcoords_loc;

var texture0;
var u_texture;
var u_diffuseColor;     // Locations of uniform variables in the shader program
var u_specularColor;
var u_specularExponent;
var u_lightPosition;
var u_modelview;
var u_projection;
var u_normalMatrix;
var u_lightPositions;
var u_lightAngleLimit;
var u_lightDir;
var u_attenuation;
var u_drawMode;
var u_lightAngleLimit;
var u_lightEnable;


var projection = mat4.create();    // projection matrix
//var modelview;     // modelview matrix; value comes from rotator
var normalMatrix = mat3.create();  // matrix, derived from modelview matrix, for transforming normal vectors
var rotator;

var cameraNode = new Node ("camera", new Transform({translate: [0, -3, -4], rotateDeg : 0, rotateAxis : [0,0,1]}), nullAnim, null);
cameraNode.yaw = 0;
cameraNode.pitch = 0;
cameraNode.yawDelta = 0;
cameraNode.pitchDelta = 0;
cameraNode.mouseYawDelta = 0;
cameraNode.mousePitchDelta = 0;

var currentlyPressedKeys = {};

var canvas;

var suppressDefaultEventHandlers = false;

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
    if (suppressDefaultEventHandlers) {
        event.preventDefault();
    }
}


function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleFocusLoss(event) {
    currentlyPressedKeys = {};
    cameraNode.mouseYawDelta = 0;
    cameraNode.mousePitchDelta = 0;
}

function handleOnClick(event) {
    canvas.requestPointerLock();
}

var deg2rad = Math.PI / 180;
var rad2deg = 180 / Math.PI;
var rightAngle = Math.PI / 2;

var forwardSpeed = 10;
var rightSpeed = 10;
var upSpeed = 2.5;
var yawSpeedRadians = 2.5;
var pitchSpeedRadians = 2.5;
var pointerYawRadians = 0.1;
var pointerPitchRadians = 0.1;

function handlePointer(event) {
    cameraNode.mouseYawDelta = event.movementX * pointerPitchRadians;
    cameraNode.mousePitchDelta = event.movementY * pointerYawRadians;
}

function handlePointerLockChange(event) {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
        console.log('The pointer lock status is now locked');
        document.addEventListener("mousemove", handlePointer, false);
        suppressDefaultEventHandlers = true;
    } else {
        console.log('The pointer lock status is now unlocked');  
        document.removeEventListener("mousemove", handlePointer, false);
        suppressDefaultEventHandlers = false;
        cameraNode.yawDelta = 0;
        cameraNode.pitchDelta = 0;
    }
}

function handleKeys() {
    if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
        // Up cursor key or W
        cameraNode.forwardDelta = forwardSpeed;
    } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
        // Down cursor key or S
        cameraNode.forwardDelta = -forwardSpeed;
    } else {
        cameraNode.forwardDelta = 0;
    }
    
    if (currentlyPressedKeys[65]) {
        //A
        cameraNode.rightDelta = -rightSpeed;
    } else if (currentlyPressedKeys[68]) {
        //D
        cameraNode.rightDelta = rightSpeed;
    } else {
        cameraNode.rightDelta = 0;
    }

    if (currentlyPressedKeys[32]) {
        //space
        cameraNode.upDelta = upSpeed;
    } else if (currentlyPressedKeys[17]) {
        //control
        cameraNode.upDelta = -upSpeed;
    } else {
        cameraNode.upDelta = 0;
    }

    if (currentlyPressedKeys[74]) {
        //J
        cameraNode.yawDelta = -yawSpeedRadians;
    } else if (currentlyPressedKeys[76]) {
        //L
        cameraNode.yawDelta = yawSpeedRadians;
    } else {
        cameraNode.yawDelta = 0;
    }


    if (currentlyPressedKeys[73]) {
        //I
        cameraNode.pitchDelta = -pitchSpeedRadians;
    } else if (currentlyPressedKeys[75]) {
        //K
        cameraNode.pitchDelta = pitchSpeedRadians;
    } else {
        cameraNode.pitchDelta = 0;
    }

}

cameraNode.animate = function(delta) {
    cameraNode.yaw += delta * cameraNode.yawDelta + delta * cameraNode.mouseYawDelta;
    cameraNode.pitch += delta * cameraNode.pitchDelta + delta * cameraNode.mousePitchDelta;

    // clamp pitch value
    cameraNode.pitch = Math.min(Math.max(cameraNode.pitch, -89 * deg2rad), 89 * deg2rad);
    var camQuat = quat.create();
    quat.rotateX(camQuat, camQuat, cameraNode.pitch);
    quat.rotateY(camQuat, camQuat, cameraNode.yaw);

    cameraNode.transform.rotate.quat = camQuat;
    cameraNode.transform.translate[0] += delta * cameraNode.forwardDelta * -Math.sin(cameraNode.yaw)
                                       + delta * cameraNode.rightDelta * -Math.sin(cameraNode.yaw + rightAngle);
    cameraNode.transform.translate[1] += delta * -cameraNode.upDelta;
    cameraNode.transform.translate[2] += delta * cameraNode.forwardDelta * Math.cos(cameraNode.yaw)
                                       + delta * cameraNode.rightDelta * Math.cos(cameraNode.yaw + rightAngle);

    cameraNode.mouseYawDelta = 0;
    cameraNode.mousePitchDelta = 0;
}

// Load glsl program from html sources.
function createProgram(gl, vertexShaderID, fragmentShaderID) {
    function getTextContent( elementID ) {
            // This nested function retrieves the text content of an
            // element on the web page.  It is used here to get the shader
            // source code from the script elements that contain it.
        var element = document.getElementById(elementID);
        var node = element.firstChild;
        var str = "";
        while (node) {
            if (node.nodeType == 3) // this is a text node
                str += node.textContent;
            node = node.nextSibling;
        }
        return str;
    }
    try {
        var vertexShaderSource = getTextContent( vertexShaderID );
        var fragmentShaderSource = getTextContent( fragmentShaderID );
    }
    catch (e) {
        throw "Error: Could not get shader source code from script elements.";
    }
    var vsh = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource(vsh,vertexShaderSource);
    gl.compileShader(vsh);
    if ( ! gl.getShaderParameter(vsh, gl.COMPILE_STATUS) ) {
        throw "Error in vertex shader:  " + gl.getShaderInfoLog(vsh);
     }
    var fsh = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource(fsh, fragmentShaderSource);
    gl.compileShader(fsh);
    if ( ! gl.getShaderParameter(fsh, gl.COMPILE_STATUS) ) {
       throw "Error in fragment shader:  " + gl.getShaderInfoLog(fsh);
    }
    var prog = gl.createProgram();
    gl.attachShader(prog,vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS) ) {
       throw "Link error in program:  " + gl.getProgramInfoLog(prog);
    }
    return prog;
}

// initialize / attach variables for glsl shader.
function initGL() {
    var prog = createProgram(gl,"vshader-source","fshader-source");
    gl.useProgram(prog);
    a_coords_loc =  gl.getAttribLocation(prog, "a_coords");
    a_normal_loc =  gl.getAttribLocation(prog, "a_normal");
    a_texcoords_loc = gl.getAttribLocation(prog, "a_texcoords");

    u_modelview = gl.getUniformLocation(prog, "modelview");
    u_projection = gl.getUniformLocation(prog, "projection");
    u_normalMatrix =  gl.getUniformLocation(prog, "normalMatrix");
    u_lightPosition=  gl.getUniformLocation(prog, "lightPosition");
    u_diffuseColor =  gl.getUniformLocation(prog, "diffuseColor");
    u_specularColor =  gl.getUniformLocation(prog, "specularColor");
    u_specularExponent = gl.getUniformLocation(prog, "specularExponent");
    u_lightPositions = gl.getUniformLocation(prog, "lightPositions");
    u_attenuation = gl.getUniformLocation(prog, "attenuation");
    u_lightDir = gl.getUniformLocation(prog, "lightDir");
    u_drawMode = gl.getUniformLocation(prog, "drawMode");
    u_lightAngleLimit = gl.getUniformLocation(prog, "lightAngleLimit");
    u_lightEnable = gl.getUniformLocation(prog, "enable");
    u_texture = gl.getUniformLocation(prog, "texture");

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.uniform3f(u_specularColor, 0.5, 0.5, 0.5);     
    gl.uniform1f(u_specularExponent, 10);
    texture0 = gl.createTexture();

}

function loadTextures(textures) {
    textures.readycount = textures.length;
    for (var i = 0; i < textures.length ; ++i) {
        textures[i].data = new Image();
        textures[i].data.onload = function() {
            textures.readycount--;
        }
        textures[i].data.src = textures[i].src;
    }
}

function installModel(node) {
    gl.bindBuffer(gl.ARRAY_BUFFER, node.mesh.coordsBuffer);
    gl.vertexAttribPointer(a_coords_loc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_coords_loc);

    gl.bindBuffer(gl.ARRAY_BUFFER, node.mesh.normalBuffer);
    gl.vertexAttribPointer(a_normal_loc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_normal_loc);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, node.mesh.indexBuffer);

    gl.bindBuffer(gl.ARRAY_BUFFER, node.mesh.texcoordsBuffer);
    gl.vertexAttribPointer(a_texcoords_loc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_texcoords_loc);

    if (node.material.textureID != null) {
        gl.bindTexture(gl.TEXTURE_2D, texture0);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, textures[node.material.textureID].data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    gl.uniform1i(u_texture, 0);
}

var drawModeOverride = 0;

function drawModel(node, modelview) {
    gl.uniform4fv(u_diffuseColor, node.material.diffuseColor);
    installModel(node);
    if (drawModeOverride == 0) {
        gl.uniform1i(u_drawMode, node.material.drawMode);
    } else {
        gl.uniform1i(u_drawMode, drawModeOverride);
    }
    mat3.normalFromMat4(normalMatrix, modelview);
    gl.uniformMatrix3fv(u_normalMatrix, false, normalMatrix);
    gl.uniformMatrix4fv(u_modelview, false, modelview );
    gl.uniformMatrix4fv(u_projection, false, projection );
    gl.drawElements(gl.TRIANGLES, node.mesh.indices.length, gl.UNSIGNED_SHORT, 0);
}


function rdraw(node, mv) {
    var modelview = mat4.create();
    var scmodelview = mat4.create();
    mat4.multiply(modelview, mv, node.getLocalTransform());
    mat4.multiply(scmodelview, mv, node.getScalelessTransform());
    if (node instanceof Model) {
        drawModel(node, modelview);
    }

    for (var child of node.nodeChildren) {
        if (node.inheritScale)
            rdraw(child, modelview);
        else
            rdraw(child, scmodelview);
    }
}

function loadLights(viewMatrix, lights) {
    var dbgstr = "";
    var transformPos = [];
    var attenuation = [];
    var enable = [];
    for (var light of lights) {
        var trs = light.getWorldSpaceTransform();
        var lmat = mat4.create();
        var ltrans = vec3.create();
        mat4.multiply(lmat, viewMatrix, trs);
        mat4.getTranslation(ltrans, lmat);
        for (var i = 0; i < 3; ++i) {
            transformPos.push(ltrans[i]);
        }

        enable.push(light.enable);
        attenuation.push(light.atten);

        dbgstr +=ltrans + "\n";
    }
    gl.uniform3fv(u_lightPositions, transformPos);
    gl.uniform1fv(u_attenuation, attenuation);
    gl.uniform1fv(u_lightEnable, enable);
}

function getViewMatrix() {
    // override getTransformMatrix from Node for the Camera.
    var out = mat4.create();
    var rot = mat4.create();
    var trn = mat4.create();
    mat4.translate(trn, trn, cameraNode.transform.translate);
    mat4.fromQuat(rot, cameraNode.transform.rotate.getQuat());
    mat4.multiply(out, out, rot);
    mat4.multiply(out, out, trn);
    
    return out;
}

function bufferModels(node) {
    if (node instanceof Model) {
        node.fillBuffers(gl);
    }
    for (var child of node.nodeChildren) {
        bufferModels(child);
    }
}

function drawParticles(particlesets, viewMatrix) {
    for (var node of particlesets) {
        var modelview = mat4.create();
        mat4.multiply(modelview, viewMatrix, node.getLocalTransform());
        gl.uniform4fv(u_diffuseColor, node.material.diffuseColor);
        gl.uniform1i(u_drawMode, node.material.drawMode);

        gl.bindBuffer(gl.ARRAY_BUFFER, node.coordsBuffer);
        gl.vertexAttribPointer(a_coords_loc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_coords_loc);

        gl.uniformMatrix4fv(u_modelview, false, modelview);
        gl.uniformMatrix4fv(u_projection, false, projection);

        if (node.material.drawMode == DrawMode.POINT_TEXTURED && node.material.textureID != null) {
            gl.bindTexture(gl.TEXTURE_2D, texture0);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, textures[node.material.textureID].data);
            gl.generateMipmap(gl.TEXTURE_2D);
        }

        gl.drawArrays(gl.POINTS,0,node.vertexCount);
    }
}

function bufferParticles(particles) {
    for (var node of particles) {
        node.fillBuffers(gl);
    }
}

function animateParticles(particles, delta) {
    for (var node of particles) {
        node.animate(gl, delta);
    }
}

function draw() {
    if (textures.readycount == 0) {
        var viewMatrix = getViewMatrix();
        loadLights(viewMatrix, lights);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.disable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);

        // root, particles defined in modeldata.js
        rdraw(root, viewMatrix);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.depthMask(false);
        
        drawParticles(particlesets, viewMatrix);
    }
}

function animate(node, delta) {
    node.animate(delta);
    for (var child of node.nodeChildren) {
        animate(child, delta);
    }
}

function init() {
    //var canvas;
    try {
        canvas = document.getElementById("myGLCanvas");
        gl = canvas.getContext("webgl") || 
            canvas.getContext("experimental-webgl");
        if ( ! gl ) {
            throw "Browser does not support WebGL";
        }
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not get a WebGL graphics context.</p>";
        return;
    }
    try {
        initGL();  // initialize the WebGL graphics context
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not initialize the WebGL graphics context:" + e + "</p>";
        return;
    }
    projection = mat4.perspective(projection, Math.PI / 2,canvas.width / canvas.height,0.1,100);

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    document.onblur = handleFocusLoss;
    canvas.onclick = handleOnClick;

    // request pointer lock
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    
    // bind pointer lock handlers
    document.addEventListener('pointerlockchange', handlePointerLockChange, false);
    document.addEventListener('mozpointerlockchange', handlePointerLockChange, false);

    document.getElementById("enableAnimate").checked = false;
    //rotator = new TrackballRotator(canvas, draw, 30);

    bufferModels(root);
    bufferParticles(particlesets);
    loadTextures(textures);

    draw();
    requestAnimationFrame(tick);
}

var prev = performance.now();
function tick(timestamp) {
    var delta = timestamp - prev;
    prev = timestamp;
    delta = delta / 1000;
    requestAnimationFrame(tick);
    handleKeys();
    cameraNode.animate(delta);
    draw();
    if (document.getElementById("enableAnimate").checked) {
        animate(root, delta);
        animateParticles(particlesets, delta);
    }
}
