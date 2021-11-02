"use strict";

var vp_width = 920, vp_height = 690; //declare variables to hold the viewport size

//declare global variables to hold the framework objects
var viewport, world, engine, body;

var ground;
var crate;
var fuzzball;


class c_ground {
	constructor(x, y, width, height) {
		let options = {
			isStatic: true,
			restitution: 0.99,
			friction: 0.20,
			density: 0.99,
		}
		//create the body
		this.body = Matter.Bodies.rectangle(x, y, width, height, options);
		Matter.World.add(world, this.body); //add to the matter world
		
		this.x = x; //store the passed variables in the object
		this.y = y;
		this.width = width;
		this.height = height;
	}

	body() {
		return this.body; //return the created body
	}

	show() {
		let pos = this.body.position; //create an shortcut alias 
		rectMode(CENTER); //switch centre to be centre rather than left, top
		fill('#ffffff'); //set the fill colour
		rect(pos.x, pos.y, this.width, this.height); //draw the rectangle
	}
}


class c_crate {
	constructor(x, y, width, height) {
		let options = {
			restitution: 0.99,
			friction: 0.030,
			density: 0.99,
			frictionAir: 0.032,
		}
		//create the body
		this.body = Matter.Bodies.rectangle(x, y, width, height, options);
		Matter.World.add(world, this.body); //add to the matter world
		
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	body() {
		return this.body; //return the created body
	}

	show() {
		let pos = this.body.position; //create an shortcut alias 
		let angle = this.body.angle;

		push(); //p5 translation 
			stroke("#000000");
			fill('#ffffff');
			rectMode(CENTER); //switch centre to be centre rather than left, top
			translate(pos.x, pos.y);
			rotate(angle);
			rect(0, 0, this.width, this.height);
		pop();
	}
}


class c_fuzzball {
	constructor(x, y, diameter) {
		let options = {
			restitution: 0.90,
			friction: 0.005,
			density: 0.95,
			frictionAir: 0.005,
		}
		this.body = Matter.Bodies.circle(x, y, diameter/2, options); //matter.js used radius rather than diameter
		Matter.World.add(world, this.body);
		
		this.x = x;
		this.y = y;
		this.diameter = diameter;
	}

	body() {
		return this.body;
	}

	show() {
		let pos = this.body.position;
		let angle = this.body.angle;

		push(); //p5 translation 
			translate(pos.x, pos.y);
			rotate(angle);
			fill('#ffffff');
			ellipseMode(CENTER); //switch centre to be centre rather than left, top
			circle(0, 0, this.diameter);
		pop();
	}
}


function apply_velocity() {
	Matter.Body.setVelocity( fuzzball.body, {x: get_random(0, 20), y: get_random(0, 20)*-1});
};


function apply_angularvelocity() {
	Matter.Body.setAngularVelocity( crate.body, Math.PI/get_random(3, 20));
};


function apply_force() {	
	Matter.Body.applyForce( crate.body, {
		x: crate.body.position.x, 
		y: crate.body.position.y
	}, {
		x: 0.05, 
		y: get_random(50, 200)*-1
	});
};


function get_random(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


function preload() {
	//p5 defined function
}


function initialiseGame() {
	ground = new c_ground(vp_width/2, vp_height-10, vp_width, 20);
	crate = new c_crate(get_random(500, 650), 400, 120, 120);
	fuzzball = new c_fuzzball(400, 200, 60); 
}


function setup() {
	//this p5 defined function runs automatically once the preload function is done
	viewport = createCanvas(vp_width, vp_height); //set the viewport (canvas) size
	viewport.parent("viewport_container"); //move the canvas so it’s inside the target div
	
	//enable the matter engine
	engine = Matter.Engine.create();
	world = engine.world;
	body = Matter.Body;

	initialiseGame(); //once the matter engine is invoked we can create our objects

	frameRate(60);
}


function paint_background() {
	//access the game object for the world, use this as a background image for the game
	background('#4c738b'); 
}


function paint_assets() {
	ground.show();
	crate.show()	
	fuzzball.show();
}


function draw() {
	//this p5 defined function runs every refresh cycle
	Matter.Engine.update(engine); //run the matter engine update

	paint_background(); //paint the default background
	paint_assets(); //paint the assets
}
