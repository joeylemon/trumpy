var Agent = function(id, loc, size, circle){
	if(!loc){
		this.setRandomLocation();
	}else{
		this.x = loc.x;
		this.y = loc.y;
	}
	
	this.id = id;
	
	if(id){
		if(purchases[id].options.add_delay){
			this.delay = purchases[id].options.add_delay;
		}else{
			this.delay = purchases[id].options.delay;
		}
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

Agent.prototype.canDeport = function(now){
	return (now - this.lastAdd > this.delay && people.length < settings.max_people);
};

Agent.prototype.deport = function(){
	var now = Date.now();
	if(this.canDeport(now)){
		addPerson({x: rand(this.x - 10, this.x + 10), y: rand(this.y - 10, this.y + 10)});
		this.lastAdd = now;
	}
};

Agent.prototype.draw = function(){
	ctx_agents.drawImage(this.img, this.x - this.size.width / 2, this.y - this.size.height / 2, this.size.width, this.size.height);
};