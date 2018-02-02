var Person = function(start, south){
    if(!start){
		this.setRandomLocation();
	}else{
		this.x = start.x;
		this.y = start.y;
        this.dir = start.dir;
	}
	
    var border;
    if(!south){
        border = getRandomBorder(this.dir, true);
    }else{
        border = getRandomMainLocation();
    }
	
	this.dest = {
		x: border.x + rand(-20, 20),
		y: border.y + rand(-5, 5)
	};
	
	this.id = getNextID();
	
	this.speed = unroundedRand(0.3, 0.6);
	
	this.color = getRandomColor();
};

Person.prototype.fromData = function(data){
	this.x = data.x;
	this.y = data.y;
	this.dest = data.dest;
	this.id = data.id;
	this.speed = data.speed;
	
	this.color = getRandomColor();
	
	return this;
};

Person.prototype.setRandomLocation = function(){
	var loc = getRandomLocation();
	this.x = loc.x;
	this.y = loc.y;
    if(this.x < (canvas.width / 4) + 53.6){
        this.dir = getRandomDirection();
    }else{
        this.dir = "S";
    }
	
	/*
	if(distance({x: x, y: y}, {x: (canvas.width / 2) + 180, y: (canvas.height / 2) - 319}) < 50){
		this.setRandomLocation();
	}else{
		this.x = x;
		this.y = y;
	}
	*/
};

Person.prototype.draw = function(){
	var tx = this.dest.x - this.x;
	var ty = this.dest.y - this.y;
	var dist = Math.sqrt(tx * tx + ty * ty);
	
	if(dist > settings.fade_dist){
		this.x += (tx / dist) * this.speed;
		this.y += (ty / dist) * this.speed;
		
		ctx.fillStyle = "rgba(" + this.color + ", 1)";
		ctx.fillRect(this.x, this.y, settings.person_size, settings.person_size);
	}else if(dist > 1){
		this.x += (tx / dist) * this.speed;
		this.y += (ty / dist) * this.speed;
		
		ctx.fillStyle = "rgba(" + this.color + ", " + (dist / settings.fade_dist) + ")";
		ctx.fillRect(this.x, this.y, settings.person_size, settings.person_size);
	}else{
		people_to_remove.push(this.id);
	}
};