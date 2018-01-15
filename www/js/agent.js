var Agent = function(id, loc, size){
	if(!loc){
		this.setRandomLocation();
	}else{
		this.x = loc.x;
		this.y = loc.y;
	}
	
	this.id = id;
	
	if(id){
		this.delay = purchases[id].options.delay;
		this.color = purchases[id].options.color;
	}
	
	if(!size && id){
		this.size = {width: purchases[id].options.size, height: purchases[id].options.size};
	}else{
		this.size = size;
	}
	
	this.lastDeport = 0;
};

Agent.prototype.fromData = function(data){
	this.x = data.x;
	this.y = data.y;
	
	this.id = data.id;
	
	this.delay = data.delay;
	this.color = data.color;
	
	this.size = data.size;
	
	this.lastDeport = Date.now() - (Math.random() * 3000);
	
	return this;
};

Agent.prototype.setRandomLocation = function(){
	var x = rand(bounds.top_left_x, bounds.top_right_x);
	var y = rand(bounds.top_left_y, bounds.bottom_right_y);
	this.x = x;
	this.y = y;
	
	/*
	if(distance({x: x, y: y}, {x: (canvas.width / 2) + 180, y: (canvas.height / 2) - 319}) < 50){
		this.setRandomLocation();
	}else{
		this.x = x;
		this.y = y;
	}
	*/
};

Agent.prototype.canDeport = function(){
	return (Date.now() - this.lastDeport > this.delay);
};

Agent.prototype.deport = function(){
	addPerson({x: rand(this.x - 10, this.x + 10), y: rand(this.y - 10, this.y + 10)});
	this.lastDeport = Date.now();
};

Agent.prototype.draw = function(){
	ctx.globalAlpha = 0.95;
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, this.size.width, this.size.height);
	ctx.globalAlpha = 1;
};