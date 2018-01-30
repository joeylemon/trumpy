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
	
	this.animation = 0;
	this.resetAnimating = false;
};

Agent.prototype.fromData = function(data){
	this.x = data.x;
	this.y = data.y;
	
	this.id = data.id;
	
	this.img = purchases[this.id].img;
	
	this.delay = data.delay;
	
	this.size = data.size;
	
	this.max = data.max;
	
	this.deport_total = unroundedRand(0, 1);
	this.lastAdd = Date.now();
	
	this.animation = settings.agent_animation_steps;
	this.resetAnimating = false;
	
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
	var size = this.size;

	if(this.resetAnimating){
		this.resetAnimating = false;
		this.animation = settings.agent_animation_steps;
		
		if(agentCancelTask){
			clearInterval(agentCancelTask);
		}
		agentCancelTask = setTimeout(function(){
			agentsAnimating = false;
			agentCancelTask = undefined;
		}, 1000);
	}else if(this.animation < settings.agent_animation_steps){
		agentsAnimating = true;
		
		var diff = (settings.agent_animation_steps / settings.agent_animation_factor) - (this.animation / settings.agent_animation_factor);
		size = {width: this.size.width * diff, height: this.size.height * diff};
		
		this.animation++;
		if(this.animation >= settings.agent_animation_steps || size.width < this.size.width){
			this.resetAnimating = true;
		}
	}
	
	ctx_agents.drawImage(this.img, this.x - size.width / 2, this.y - size.height / 2, size.width, size.height);
};