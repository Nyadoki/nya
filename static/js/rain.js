var canvas, ctx, DPR, options, canvasWidth, canvasHeight, wind_anger;
var hasBounce, maxNum, numLevel, speed, wind_direction, drop_chance, gravity;
var speed_x, speed_y;
var drops = [], bounces = [];

var eachAnger = 0.017453293; 

window.requestAnimFrame =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback) {
	window.setTimeout(callback, 1000 / 30);
};


function Rain(opts) {
	options = opts;
	canvas = document.createElement( 'canvas' );
	document.body.appendChild( canvas );
	canvas.style.position = 'fixed';
	canvas.style.top = 0;
	canvas.style.zIndex = 1000;
	canvas.style.pointerEvents = 'None';
	canvas.style.width = window.innerWidth + 'px';
	canvas.style.height = window.innerHeight + 'px';
	ctx = canvas.getContext('2d');
	DPR = window.devicePixelRatio;
	canvas.width = canvas.clientWidth * DPR;
	canvas.height = canvas.clientHeight * DPR;

	speed = opts.speed || [10,100]; 
	hasBounce = opts.hasBounce == undefined ? true : opts.hasBounce; 

	var wind_max = 270 + Math.atan(canvas.width/canvas.height) / eachAnger 
	var wind_min = 270 - Math.atan(canvas.width/canvas.height) / eachAnger

	if(opts.wind_direction > wind_max) {
		wind_direction = wind_max
	}else if(opts.wind_direction < wind_min){
		wind_direction = wind_min
	}else{
		wind_direction = opts.wind_direction || 270;
	}
	maxNum = opts.maxNum || 1000; 
	numLevel = opts.numLevel || 10;
	drop_chance = opts.drop_chance || 0.1; 
	gravity = opts.gravity || 0.163; 

	setStyle();
	update();
};

function setStyle(){
	ctx.lineWidth = 1.5 * DPR;
	ctx.fillStyle = 'rgba(223,223,223,0.6)';
};

function update() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var i = drops.length;
	while (i--) {
		var drop = drops[i];
		drop.update();

		if (drop.pos.y >= canvas.height) {

			if(hasBounce){
				var n = Math.round(4 + Math.random() * 4);
				while (n--) bounces.push(new Bounce(drop.pos.x, canvas.height));
			};

			drops.splice(i, 1);
		}
		drop.draw();
	};

	if(hasBounce){
		var i = bounces.length;
		while (i--) {
			var bounce = bounces[i];
			bounce.update();
			bounce.draw();
			if (bounce.pos.y > canvas.height) bounces.splice(i, 1);
		};
	};

	if(drops.length < maxNum){
		if (Math.random() < drop_chance) {
			var i = 0, len = numLevel;
			for(; i<len; i++){
				drops.push(new Drop());
			};
		};
	};

	window.addEventListener( 'resize', onWindowResize, false );

	requestAnimFrame(update);
};

function onWindowResize() {
	canvas.style.width = window.innerWidth + 'px';
	canvas.style.height = window.innerHeight + 'px';
	canvas.width = canvas.clientWidth * DPR;
	canvas.height = canvas.clientHeight * DPR;
	setStyle();
};

var Vector = function(x, y) {
	this.x = x || 0;
	this.y = y || 0;
};

Vector.prototype.add = function(v) {
	if (v.x != null && v.y != null) {
		this.x += v.x;
		this.y += v.y;
	} else {
		this.x += v;
		this.y += v;
	};
	return this;
};

Vector.prototype.copy = function() {
	return new Vector(this.x, this.y);
};

var Drop = function() {

	var edge = Math.tan((270 - wind_direction) * eachAnger) * canvas.height;

	if(edge >= 0){
		this.pos = new Vector(Math.random() * (canvas.width + edge), 0)
	}else{
		this.pos = new Vector(Math.random() * (canvas.width - edge) + edge, 0)
	}

	this.speed = (speed[0] + Math.random() * speed[1]) * DPR;
	this.prev = this.pos;

	wind_anger = wind_direction * eachAnger;

	speed_x = this.speed * Math.cos(wind_anger);

	speed_y = - this.speed * Math.sin(wind_anger);

	this.vel = new Vector(speed_x, speed_y);
};

Drop.prototype.update = function() {
	this.prev = this.pos.copy();

	if (gravity) {
		this.vel.y += gravity;
	};
	this.pos.add(this.vel);
	this.setStyle();
};

Drop.prototype.setStyle = function() {
	var color = ctx.createLinearGradient(this.prev.x,this.prev.y,this.pos.x,this.pos.y);
   	color.addColorStop(0,'rgba(0,0,0,0');
   	color.addColorStop(0.5,'rgba(223,223,223,0.6)');
   	ctx.strokeStyle = color;
};

Drop.prototype.draw = function() {
	ctx.beginPath();
	ctx.moveTo(this.prev.x, this.prev.y);
	ctx.lineTo(this.pos.x, this.pos.y);
	ctx.stroke();
};

var Bounce = function(x, y) {
	var dist = Math.random() * 7;
	var angle = Math.PI + Math.random() * Math.PI;
	this.pos = new Vector(x, y);
	this.radius = 0.2+ Math.random()*0.8;
	this.vel = new Vector( Math.cos(angle) * dist, Math.sin(angle) * dist);
};

Bounce.prototype.update = function() {
	this.vel.y += gravity;
	this.vel.x *= 0.95;
	this.vel.y *= 0.95;
	this.pos.add(this.vel);
};

Bounce.prototype.draw = function() {
	ctx.beginPath();
	ctx.arc(this.pos.x, this.pos.y, this.radius*DPR, 0, Math.PI * 2);
	ctx.fill();
};