var root = new Node(
    "root",
    nullT, 
    nullAnim,
    undefined);
var ground = new Model("ground", uvCylinder(), new Material({diffuseColor: [0, .5, 0, 1],  drawMode:DrawMode.TEXTURED_FLAT}), new Transform({rotateDeg: -90, rotateAxis: [1, 0, 0], scale: [15, 15, 1]}), nullAnim, root);
var road = new Model("road", ring(.6, 1), new Material({diffuseColor:[.5, .5, .5, 1]}), new Transform({translate: [0, 0, .51], scale: [6, 6, 1]}), 
    new Transform({rotateDeg: .5, rotateAxis: [0, 0, 1], scale: [0, 0, 0]}), ground);
var tree1 = new Tree("t1", new Transform({translate: [3, 6, .5], rotateDeg: 90, rotateAxis: [1, 0, 0], scale: [1, 1.8, 1]}), nullAnim, ground);
var tree2 = new Tree("t2", new Transform({translate: [-1, -1, .5], rotateDeg: 90, rotateAxis: [1, 0, 0], scale: [1, 0.9, 1]}), nullAnim, ground);
var tree3 = new Tree("t3", new Transform({translate: [-5, -5, .5], rotateDeg: 90, rotateAxis: [1, 0, 0], scale: [1, 2, 1]}), nullAnim, ground);
var tree3 = new Tree("t4", new Transform({translate: [-4, -6, .5], rotateDeg: 90, rotateAxis: [1, 0, 0], scale: [1, 1.5, 1]}), nullAnim, ground);

var car = new Car("car", new Transform({translate: [0, -5, .55], rotateDeg: 90, rotateAxis: [1, 0, 0]}), nullAnim, road);
var lightpost = new Model("lightpost base", uvCylinder(), new Material(), new Transform({translate: [0, 0, 1], scale: [0.5, 0.5, 2]}), nullAnim, ground);
var lightmodel = new Model("lightpost bulb", uvSphere(), new Material({diffuseColor: [1, 1, 0, 1], drawMode:DrawMode.FLAT}), new Transform({translate: [0, 0, 1], scale: [0.7, 0.7, 0.7]}), nullAnim, lightpost);
var lightbulb = new Light("lightpost emitter", new Transform({translate: [0, 0, 1]}), nullAnim, lightmodel, {type: "point", atten: 1000});

lightmodel.lightOverride = true;

lights = [lightbulb];
