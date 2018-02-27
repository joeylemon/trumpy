var Agent = function(id, loc, size, no_deport){
	if(!loc){
		this.setRandomLocation();
	}else{
		this.x = loc.x;
		this.y = loc.y;
        this.setDirection();
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
	
	this.no_deport = no_deport;
};

Agent.prototype.fromData = function(data){
	this.x = data.x;
	this.y = data.y;
    this.dir = data.dir;
	
	this.id = data.id;
	
	this.img = purchases[this.id].img;
	
	this.delay = data.delay;
	
	this.size = data.size;
	
	this.max = data.max;
	
	this.deport_total = unroundedRand(0, 1);
	this.lastAdd = Date.now();
	
	this.no_deport = data.no_deport;
	
	return this;
};

Agent.prototype.setRandomLocation = function(){
	var loc = getRandomLocation(true);
	this.x = loc.x;
	this.y = loc.y;
    this.setDirection();
	
	/*
	if(distance({x: x, y: y}, {x: (canvas.width / 2) + 180, y: (canvas.height / 2) - 319}) < 50){
		this.setRandomLocation();
	}else{
		this.x = x;
		this.y = y;
	}
	*/
};

Agent.prototype.setDirection = function(){
    var mid_x = (canvas.width / 4) + 53.6;
    var mid_y = (middle_y - 25);
    
    if(this.x < mid_x && this.y < mid_y){
        this.dir = "N";
    }else if(this.x < mid_x && this.y >= mid_y){
        this.dir = "S";
    }else{
        this.dir = "E";
    }
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
		addPerson({x: rand(this.x - 10, this.x + 10), y: rand(this.y - 10, this.y + 10), dir: this.dir});
		this.deport_total = 0;
	}

	var diff = now - this.lastAdd;
	var add = diff / this.delay;
	deported += add;
	this.deport_total += add;
	
	this.lastAdd = now;
};

Agent.prototype.draw = function(){
    var x = this.x - this.size.width / 2;
    var y = this.y - this.size.height / 2;
	ctx.drawImage(this.img, x, y, this.size.width, this.size.height);
    if(this.id == "sanctuary_city"){
        ctx.fillStyle = "#000";
        ctx.fillText("Aliandra", x - 1, y + this.size.height + 4);
    }
};