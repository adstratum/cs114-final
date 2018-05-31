"use strict";

var gl;   // The webgl context.

var a_coords_loc;       // Location of the a_coords attribute variable in the shader program.
var a_normal_loc;       // Location of a_normal attribute.
var a_texcoords_loc;

var a_coords_buffer;    // Buffer for a_coords.
var a_normal_buffer;    // Buffer for a_normal.
var index_buffer;       // Buffer for indices.
var a_texture_buffer;
var a_texcoords_buffer;

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

    a_coords_buffer = gl.createBuffer();
    a_normal_buffer = gl.createBuffer();
    index_buffer = gl.createBuffer();
    a_texture_buffer = gl.createBuffer();
    a_texcoords_buffer = gl.createBuffer();

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.uniform3f(u_specularColor, 0.5, 0.5, 0.5);     
    gl.uniform1f(u_specularExponent, 10);  
    //gl.uniform4f(u_lightPosition, 1, 0, 0, 1); 
}

function installModel(modelData) {
    gl.bindBuffer(gl.ARRAY_BUFFER, a_coords_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_coords_loc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_coords_loc);

    gl.bindBuffer(gl.ARRAY_BUFFER, a_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_normal_loc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_normal_loc);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, a_texcoords_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexTextureCoords, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_texcoords_loc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_texcoords_loc);
}

var drawModeOverride = 0;

function drawModel(node, modelview) {
    gl.uniform4fv(u_diffuseColor, node.material.diffuseColor);
    installModel(node.mesh);
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

function loadLights(viewMatrix) {
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
    //document.getElementById("debug-text").innerHTML = dbgstr;
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var viewMatrix = rotator.getViewMatrix();
    loadLights(viewMatrix);

    // defined in modeldata.js
    rdraw(root, viewMatrix);
}

function animate(node, delta) {
    node.animate(delta);
    for (var child of node.nodeChildren) {
        animate(child, delta);
    }
}

function init() {
    var canvas;
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
    projection = mat4.perspective(projection, Math.PI/5,canvas.width / canvas.height,1,50);

    document.getElementById("enableAnimate").checked = false;
    rotator = new TrackballRotator(canvas, draw, 30);

    draw();
    requestAnimationFrame(tick);
}

var prev = performance.now();
function tick(timestamp) {
    var delta = timestamp - prev;
    prev = timestamp;
    requestAnimationFrame(tick);
    draw();
    if (document.getElementById("enableAnimate").checked)
        animate(root, delta / 100);
}