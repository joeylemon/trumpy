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
		this.circle = purchases[id].options.circle;
		this.max = purchases[id].options.max;
		this.img = purchases[id].img;
	}
	
	if(!size && id){
		this.size = {width: purchases[id].options.size, height: purchases[id].options.size};
	}else{
		this.size = size;
	}
	
	this.deport_total = unroundedRand(0, 1);
	this.lastAdd = Date.now();
};

Agent.prototype.fromData = function(data){
	this.x = data.x;
	this.y = data.y;
	
	this.id = data.id;
	
	this.img = purchases[this.id].img;
	
	this.delay = data.delay;
	this.color = data.color;
	
	this.size = data.size;
	
	this.circle = data.circle;
	
	this.max = data.max;
	
	this.deport_total = unroundedRand(0, 1);
	this.lastAdd = Date.now();
	
	return this;
};

Agent.prototype.setRandomLocation = function(){
	var loc = getRandomLocation(true);
	this.x = loc.x;
	this.y = loc.y;
	
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
	var max = 1;
	if(this.max){
		max = this.max;
	}
	return (this.deport_total >= max && people.length < settings.max_people);
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
	
	this.lastAdd = now;
};

Agent.prototype.draw = function(){
	/*
	ctx.fillStyle = this.color;
	if(this.circle){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size.width, 0, 2 * Math.PI);
		ctx.fill();
	}else{
		var multiplier = 1.6;
		if(this.id == "wall"){
			multiplier = 1;
		}
		var width = this.size.width * multiplier;
		var height = this.size.height * multiplier;
		ctx.fillRect(this.x - (width / 2), this.y - (height / 2), width, height);
	}
	*/
	
	ctx.drawImage(this.img, this.x - this.size.width / 2, this.y - this.size.height / 2, this.size.width, this.size.height);
	
	this.deport();
};