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

var car = new Car("car", new Transform({translate: [0, -5, .55], rotateDeg: 90, rotateAxis: [1, 0, 0]}), nullAnim, road);
var lightpost = new Model("lightpost base", uvCylinder(), new Material(), new Transform({translate: [0, 0, 1], scale: [0.5, 0.5, 2]}), nullAnim, ground);
var lightmodel = new Model("lightpost bulb", uvSphere(), new Material({diffuseColor: [1, 1, 0, 1], drawMode:DrawMode.FLAT}), new Transform({translate: [0, 0, 1], scale: [0.7, 0.7, 0.7]}), nullAnim, lightpost);
var lightbulb = new Light("lightpost emitter", new Transform({translate: [0, 0, 1]}), nullAnim, lightmodel, {type: "point", atten: 1000});

var p1 = new ParticleSet("p1", new Material({diffuseColor: [0.82, 0.93, 0.11, 1]}), new Transform(), new Transform(), null);
p1.animate=function(gl,delta){
for (var i = 0; i < this.vertexCount; ++i) {
            var motion = vec3.fromValues(rRng(0.1), rRng(0.1), rRng(0.1));
            vec3.scale(motion, motion, delta);
            var position = this.getParticle(i);
            vec3.add(position, position, motion);
            this.setPosition(i, position);
        }

        this.updateBuffers(gl);
};
var p2 = new ParticleSet("p2", new Material({diffuseColor: [0.2, 0.2, 0.9, 1]}), new Transform(), new Transform(), null);
p2.animate=function(gl,delta){
for (var i = 0; i < this.vertexCount; ++i) {
	if(this.counter>1000)
	{
		//var motion = vec3.fromValues(0,0,2);
        //    vec3.scale(motion, motion, delta);
            var position = this.getParticle(i);
            this.setPosition(i, [position[0],position[1],2]);
            this.counter=0;
	}
	else{

            var motion = vec3.fromValues(0,0,(-rRng(1)-2)/10);
            vec3.scale(motion, motion, delta);
            var position = this.getParticle(i);
            vec3.add(position, position, motion);
            this.setPosition(i, position);
            this.counter++;
        }
        }

        this.updateBuffers(gl);
};
var p3 = new ParticleSet("p3", new Material({diffuseColor: [1, 1, 1, 1]}), new Transform(), new Transform(), null);
p3.animate=function(gl,delta){
for (var i = 0; i < this.vertexCount; ++i) {
    if(this.counter>1000)
    {
        //var motion = vec3.fromValues(0,0,2);
        //    vec3.scale(motion, motion, delta);
            var position = this.getParticle(i);
            this.setPosition(i, [rRng(1),rRng(1),2]);
    }
    else if(this.counter>500 && this.counter<1000){

            var motion = vec3.fromValues(rRng(1),0,-0.091);
            vec3.scale(motion, motion, delta);
            var position = this.getParticle(i);
            vec3.add(position, position, motion);
            this.setPosition(i, position);
            this.counter++;
        }
        else if(this.counter<500){

            var motion = vec3.fromValues(0,0,0.091);
            vec3.scale(motion, motion, delta);
            var position = this.getParticle(i);
            vec3.add(position, position, motion);
            this.setPosition(i, position);
            this.counter++;
        }
        }

        this.updateBuffers(gl);
};
lights = [lightbulb];
particlesets = [p1,p2,p3];