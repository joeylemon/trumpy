var Person = function(start){
	if(!start){
		this.setRandomLocation();
	}else{
		this.x = start.x;
		this.y = start.y;
	}
	
	var border = getRandomBorder();
	
	this.dest = {
		x: border.x + rand(-20, 20),
		y: border.y + rand(-5, 5)
	};
	
	this.id = rand(1, 10000);
	
	this.speed = unroundedRand(0.2, 0.6);
};

Person.prototype.setRandomLocation = function(){
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

Person.prototype.draw = function(){
	var tx = this.dest.x - this.x;
	var ty = this.dest.y - this.y;
	var dist = Math.sqrt(tx * tx + ty * ty);
	
	if(dist > settings.fade_dist){
		this.x += (tx / dist) * this.speed;
		this.y += (ty / dist) * this.speed;
		
		ctx.fillStyle = "rgba(132, 92, 0, 1)";
		ctx.fillRect(this.x, this.y, settings.illegal_size, settings.illegal_size);
	}else if(dist > 1){
		this.x += (tx / dist) * this.speed;
		this.y += (ty / dist) * this.speed;
		
		ctx.fillStyle = "rgba(132, 92, 0, " + (dist / settings.fade_dist) + ")";
		ctx.fillRect(this.x, this.y, settings.illegal_size, settings.illegal_size);
	}else{
		for(var i = 0; i < people.length; i++){
			if(people[i].id == this.id){
				people.splice(i, 1);
				break;
			}
		}
	}
};