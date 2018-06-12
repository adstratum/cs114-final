var nullT = new Transform({translate: [0, 0, 0], rotateDeg : 0, rotateAxis : [0,0,1]});
var nullAnim = new Transform({rotateDeg:0, rotateAxis: [0, 0, 0], scale: [0, 0, 0]});

var root = new Node(
    "root",
    nullT, 
    nullAnim,
    undefined);
var ground = new Model("ground", uvCylinder(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"grass.png"}), new Transform({rotateDeg: -90, rotateAxis: [1, 0, 0], scale: [15, 15, 1]}), nullAnim, root);
var road = new Model("road", ring(.6, 1), new Material({diffuseColor:[.5, .5, .5, 1],  drawMode:DrawMode.TEXTURED_FLAT, texture:"f-texture.png"}), new Transform({translate: [0, 0, .51], scale: [6, 6, 1]}), 
    new Transform({rotateDeg: .5, rotateAxis: [0, 0, 1], scale: [0, 0, 0]}), ground);
	
var tree1 = new Tree("t1", new Transform({translate: [3, 6, .5], rotateDeg: 90, rotateAxis: [1, 0, 0], scale: [1, 1.8, 1]}), nullAnim, ground);
var tree2 = new Tree("t2", new Transform({translate: [-1, -1, .5], rotateDeg: 90, rotateAxis: [1, 0, 0], scale: [1, 0.9, 1]}), nullAnim, ground);
var tree3 = new Tree("t3", new Transform({translate: [-5, -5, .5], rotateDeg: 90, rotateAxis: [1, 0, 0], scale: [1, 2, 1]}), nullAnim, ground);
var tree3 = new Tree("t4", new Transform({translate: [-4, -6, .5], rotateDeg: 90, rotateAxis: [1, 0, 0], scale: [1, 1.5, 1]}), nullAnim, ground);

var tl_box = new Model("tl_box", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [-35, 35, 5], scale: [30, 30, 10]}), nullAnim, ground);
var bl_box = new Model("bl_box", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [-35, -35, 5], scale: [30, 30, 10]}), nullAnim, ground);
var tr_box = new Model("tr_box", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [35, 35, 5], scale: [30, 30, 10]}), nullAnim, ground);
var br_box = new Model("br_box", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [35, -35, 5], scale: [30, 30, 10]}), nullAnim, ground);


var house = new Model("house", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [0, 0, -1], scale: [100, 100, 1]}), nullAnim, ground);

var wall = new Model("top", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [0, 50, 5], scale: [40, 1, 10]}), nullAnim, ground);
var wall2 = new Model("right", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [50, 0, 5], scale: [1, 40, 10]}), nullAnim, ground);
var wall3 = new Model("bottom", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [0, -50, 5], scale: [40, 1, 10]}), nullAnim, ground);
var wall4 = new Model("left", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [-50, 0, 5], scale: [1, 40, 10]}), nullAnim, ground);

var wall_left = new Model("wall_left", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [-14, 20.5, 5], scale: [15, 1, 10]}), nullAnim, ground);
var wall_right = new Model("wall_right", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [14, 20.5, 5], scale: [15, 1, 10]}), nullAnim, ground);

var wall2_left = new Model("wall2_left", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [20.5, 14, 5], scale: [1, 15, 10]}), nullAnim, ground);
var wall2_right = new Model("wall2_right", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [20.5, -14, 5], scale: [1, 15, 10]}), nullAnim, ground);

var wall3_left = new Model("wall3_left", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [-14, -20.5, 5], scale: [15, 1, 10]}), nullAnim, ground);
var wall3_right = new Model("wall3_right", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [14, -20.5, 5], scale: [15, 1, 10]}), nullAnim, ground);

var wall4_left = new Model("wall4_left", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [-20.5, 14, 5], scale: [1, 15, 10]}), nullAnim, ground);
var wall4_right = new Model("wall4_right", cube(), new Material({diffuseColor: [0, .5, 0, 1], drawMode:DrawMode.TEXTURED_PHONG, texture:"room.jpg"}), new Transform({translate: [-20.5, -14, 5], scale: [1, 15, 10]}), nullAnim, ground);


var car = new Car("car", new Transform({translate: [0, -5, .55], rotateDeg: 90, rotateAxis: [1, 0, 0]}), nullAnim, road);
var lightpost = new Model("lightpost base", uvCylinder(), new Material(), new Transform({translate: [0, 0, 1], scale: [0.5, 0.5, 2]}), nullAnim, ground);
var lightmodel = new Model("lightpost bulb", uvSphere(), new Material({diffuseColor: [1, 1, 0, 1], drawMode:DrawMode.FLAT}), new Transform({translate: [0, 0, 1], scale: [0.7, 0.7, 0.7]}), nullAnim, lightpost);
var lightbulb = new Light("lightpost emitter", new Transform({translate: [0, 0, 1]}), nullAnim, lightmodel, {type: "point", atten: 1000});

var p1 = new ParticleSet("p1", new Material({diffuseColor: [1, 1, 1, 1]}), new Transform(), new Transform(), null);
lights = [lightbulb];
particlesets = [p1];

