var nullT = new Transform({ translate: [0, 0, 0], rotateDeg: 0, rotateAxis: [0, 0, 1] });
var nullAnim = new Transform({ rotateDeg: 0, rotateAxis: [0, 0, 0], scale: [0, 0, 0] });

var textures = [{src: "grass.png"}, {src: "f-texture.png"}, {src: "room.jpg"}, {src: "raindrop.png"}, {src: "Snowflake.png"}];

var root = new Node(
    "root",
    nullT,
    nullAnim,
    undefined);
var ground = new Model("ground", uvCylinder(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 0, }), new Transform({rotateDeg: -90, rotateAxis: [1, 0, 0], scale: [15, 15, 1]}), nullAnim, root);
var road = new Model("road", ring(.6, 1), new Material({diffuseColor:[.5, .5, .5, 1],  drawMode:DrawMode.PHONG}), new Transform({translate: [0, 0, .51], scale: [6, 6, 1]}), 
    new Transform({rotateDeg: .5, rotateAxis: [0, 0, 1], scale: [0, 0, 0]}), ground);
	
var tree1 = new Tree("t1", new Transform({translate: [3, 6, .5], rotateDeg: 90, rotateAxis: [1, 0, 0], scale: [1, 1.8, 1]}), nullAnim, ground);
var tree2 = new Tree("t2", new Transform({translate: [-1, -1, .5], rotateDeg: 90, rotateAxis: [1, 0, 0], scale: [1, 0.9, 1]}), nullAnim, ground);
var tree3 = new Tree("t3", new Transform({translate: [-5, -5, .5], rotateDeg: 90, rotateAxis: [1, 0, 0], scale: [1, 2, 1]}), nullAnim, ground);
var tree3 = new Tree("t4", new Transform({translate: [-4, -6, .5], rotateDeg: 90, rotateAxis: [1, 0, 0], scale: [1, 1.5, 1]}), nullAnim, ground);

var tl_box = new Model("tl_box", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 2, }), new Transform({translate: [-35, 35, 5], scale: [30, 30, 10]}), nullAnim, ground);
var bl_box = new Model("bl_box", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 2,}), new Transform({translate: [-35, -35, 5], scale: [30, 30, 10]}), nullAnim, ground);
var tr_box = new Model("tr_box", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 2,}), new Transform({translate: [35, 35, 5], scale: [30, 30, 10]}), nullAnim, ground);
var br_box = new Model("br_box", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 2,}), new Transform({translate: [35, -35, 5], scale: [30, 30, 10]}), nullAnim, ground);


var house = new Model("house", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 0 ,}), new Transform({translate: [0, 0, -1], scale: [100, 100, 1]}), nullAnim, ground);

var wall = new Model("top", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 2, }), new Transform({translate: [0, 50, 5], scale: [40, 1, 10]}), nullAnim, ground);
var wall2 = new Model("right", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 2, }), new Transform({translate: [50, 0, 5], scale: [1, 40, 10]}), nullAnim, ground);
var wall3 = new Model("bottom", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 2, }), new Transform({translate: [0, -50, 5], scale: [40, 1, 10]}), nullAnim, ground);
var wall4 = new Model("left", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 2, }), new Transform({translate: [-50, 0, 5], scale: [1, 40, 10]}), nullAnim, ground);

var wall_left = new Model("wall_left", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG,textureID: 2,  }), new Transform({translate: [-14, 20.5, 5], scale: [15, 1, 10]}), nullAnim, ground);
var wall_right = new Model("wall_right", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 2, }), new Transform({translate: [14, 20.5, 5], scale: [15, 1, 10]}), nullAnim, ground);

var wall2_left = new Model("wall2_left", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 2, }), new Transform({translate: [20.5, 14, 5], scale: [1, 15, 10]}), nullAnim, ground);
var wall2_right = new Model("wall2_right", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG,  textureID: 2, }), new Transform({translate: [20.5, -14, 5], scale: [1, 15, 10]}), nullAnim, ground);

var wall3_left = new Model("wall3_left", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 2, }), new Transform({translate: [-14, -20.5, 5], scale: [15, 1, 10]}), nullAnim, ground);
var wall3_right = new Model("wall3_right", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 2, }), new Transform({translate: [14, -20.5, 5], scale: [15, 1, 10]}), nullAnim, ground);

var wall4_left = new Model("wall4_left", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 2,}), new Transform({translate: [-20.5, 14, 5], scale: [1, 15, 10]}), nullAnim, ground);
var wall4_right = new Model("wall4_right", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, textureID: 2, }), new Transform({translate: [-20.5, -14, 5], scale: [1, 15, 10]}), nullAnim, ground);


var car = new Car("car", new Transform({translate: [0, -5, .55], rotateDeg: 90, rotateAxis: [1, 0, 0]}), nullAnim, road);
var lightpost = new Model("lightpost base", uvCylinder(), new Material(), new Transform({translate: [0, 0, 1], scale: [0.5, 0.5, 2]}), nullAnim, ground);
var lightmodel = new Model("lightpost bulb", uvSphere(), new Material({diffuseColor: [1, 1, 0, 1], drawMode:DrawMode.FLAT}), new Transform({translate: [0, 0, 1], scale: [0.7, 0.7, 0.7]}), nullAnim, lightpost);
var lightbulb = new Light("lightpost emitter", new Transform({translate: [0, 0, 1]}), nullAnim, lightmodel, {type: "point", atten: 1000});

var p1 = new ParticleSet("sparks", new Material({ diffuseColor: [0.82, 0.93, 0.11, 1] }), new Transform({translate:[30,0,0]}), new Transform(), null);
for(var i=0;i<p1.vertexCount;++i)
{
    p1.setProperties(i,{velocity:[rRng(2),rRng(1)+10,rRng(2)],acceleration:[0,-9.8,0]});
    p1.setPosition(i, [0, -1, 0]);
}
p1.animate = function (gl, delta) {
    for (var i = 0; i < this.vertexCount; ++i) {
        var position = this.getPosition(i);
        var props=this.getProperties(i);
        if(position[1]<-1)
        {
            this.setPosition(i,[0,1,0]);
            p1.setProperties(i,{velocity:[rRng(4),rRng(1)+30,rRng(4)],acceleration:[0,-9.8,0]});
        }
        else
        {
            var accel=vec3.clone(props['acceleration']);
            var velo=vec3.clone(props['velocity']);
            var veldelta = vec3.create();
            vec3.add(velo,velo,accel);
            vec3.scale(veldelta,velo,delta);
            vec3.add(position,position,veldelta);
            this.setPosition(i,position);
            p1.setProperties(i,{velocity:velo,acceleration:[0, -1, 0]});
        }
    }

    this.updateBuffers(gl);
};
var p2 = new ParticleSet("rain", new Material({ diffuseColor: [0.2, 0.2, 0.9, 1] , drawMode:DrawMode.POINT_TEXTURED, textureID: 3, }), new Transform({translate:[-30,0,0],scale:[3,3,3]}), new Transform(), null);
for(var i=0;i<p2.vertexCount;++i)
{
    p2.setProperties(i,{velocity:[0,-1,0],acceleration:[0,-9.8,0]});
}
p2.animate = function (gl, delta) {
    for (var i = 0; i < this.vertexCount; ++i) {
        var position = this.getPosition(i);
        var props=this.getProperties(i);
        if(position[1]<-3)
        {
            this.setPosition(i,[position[0],5,position[2]]);
            p2.setProperties(i,{velocity:[0,0,0],acceleration:[0, -0.5, 0]});
        }
        else
        {
            var accel=vec3.clone(props['acceleration']);
            var velo=vec3.clone(props['velocity']);
            var veldelta = vec3.create();
            vec3.add(velo,velo,accel);
            vec3.scale(veldelta,velo,delta);
            vec3.add(position,position,veldelta);
            this.setPosition(i,position);
            p2.setProperties(i,{velocity:velo,acceleration:[0, -0.5, 0]});
        }
        /*
        if (this.counter > 100) {
            var position = this.getPosition(i);
            this.setPosition(i, [position[0], position[1], 2]);
            this.counter = 0;
        }
        else {

            var motion = vec3.fromValues(0, 0, (-rRng(1) - 2) / 10);
            vec3.scale(motion, motion, delta);
            var position = this.getPosition(i);
            vec3.add(position, position, motion);
            this.setPosition(i, position);
            this.counter++;
        }
        */
    }

    this.updateBuffers(gl);
};
var p3 = new ParticleSet("snow", new Material({ diffuseColor: [1, 1, 1, 1], drawMode:DrawMode.POINT_TEXTURED, textureID: 4, }), new Transform({translate:[0,0,30],scale:[3,3,3]}), new Transform(), null);
for(var i=0;i<p3.vertexCount;++i)
{
    p3.setProperties(i,{velocity:[rRng(1),-1,0],acceleration:[0,-9.8,0]});
}
p3.animate = function (gl, delta) {
     for (var i = 0; i < this.vertexCount; ++i) {
        var position = this.getPosition(i);
        var props=this.getProperties(i);
        if(position[1]<-3)
        {
            this.setPosition(i,[position[0],5,position[2]]);
        }
        else
        {
            var accel=vec3.clone(props['acceleration']);
            var velo=vec3.clone(props['velocity']);
            vec3.scale(accel,accel,delta);
            vec3.add(velo,velo,accel);
            vec3.scale(velo,velo,delta);
            vec3.add(position,position,velo);
            this.setPosition(i,position);
             p3.setProperties(i,{velocity:[rRng(1),-1,0],acceleration:[0,-9.8,0]});
        }
    }

    this.updateBuffers(gl);
};

var p4 = new ParticleSet("sharknado", new Material({ diffuseColor: [1, 0, 1, 1] }), new Transform({translate:[0,0,-30]}), new Transform(), null);
for(var i=0;i<p4.vertexCount;++i)

{
    p4.setProperties(i,{velocity:[-3,2,0],acceleration:[0,2,0]});
}
p4.animate = function (gl, delta) {
    for (var i = 0; i < this.vertexCount; ++i) {
        var position = this.getPosition(i);
        var props=this.getProperties(i);
            var accel=vec3.clone(props['acceleration']);
            var velo=vec3.clone(props['velocity']);
            vec3.scale(accel,accel,delta);
            vec3.add(velo,velo,accel);
            vec3.scale(velo,velo,delta);
            vec3.add(position,position,velo);
            this.setPosition(i,position);
            if(position[0]<-2 && velo[0]!=0){
             p4.setProperties(i,{velocity:[0,2,3],acceleration:[0,2,0]});
             
            }
            if(position[2]>2 && velo[2]!=0){
             p4.setProperties(i,{velocity:[3,2,0],acceleration:[0,2,0]});
            }
            if(position[0]>2 && velo[0]!=0){
             p4.setProperties(i,{velocity:[0,2,-3],acceleration:[0,2,0]});
            }
            if(position[2]<-2 && velo[2]!=0){
             p4.setProperties(i,{velocity:[-3,2,0],acceleration:[0,2,0]});
            }
            if(position[1]>4)
            {
                this.setPosition(i,[position[0],0,position[2]]);
            }
    }
        
    this.updateBuffers(gl);
};
lights = [lightbulb];
particlesets = [p1,p2,p3,p4];
