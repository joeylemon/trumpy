var Agent = function(id, loc, size, circle){
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
	
	if(id){
		this.circle = purchases[id].options.circle;
	}
	
	this.deport_total = unroundedRand(0, 1);
	this.lastAdd = Date.now();
};

Agent.prototype.fromData = function(data){
	this.x = data.x;
	this.y = data.y;
	
	this.id = data.id;
	
	this.delay = data.delay;
	this.color = data.color;
	
	this.size = data.size;
	
	this.circle = data.circle;
	
	this.deport_total = unroundedRand(0, 1);
	this.lastAdd = Date.now();
	
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
	return (this.deport_total >= 1);
};

Agent.prototype.deport = function(){
	var now = Date.now();
	
	if(this.canDeport()){
		addPerson({x: rand(this.x - 10, this.x + 10), y: rand(this.y - 10, this.y + 10)});
		this.deport_total = 0;
	}

	var diff = now - this.lastAdd;
	var add = diff / this.delay;
	deported += add;
	this.deport_total += add;
	//console.log("diff:" + diff + ",add:" + add);
	
	this.lastAdd = now;
};

Agent.prototype.draw = function(){
	ctx.fillStyle = this.color;
	if(this.circle){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size.width, 0, 2 * Math.PI);
		ctx.fill();
	}else{
		ctx.fillRect(this.x, this.y, this.size.width, this.size.height);
	}
	
	this.deport();
};